import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import get_words_to_init_game

waiting_player = None

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global waiting_player

        # Generate a unique UUID for the connection
        self.user_uuid = str(uuid.uuid4())
        self.group_name = "game"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        if waiting_player:
            self.opponent_uuid = waiting_player
            waiting_player = None




            await self.accept()
            # Send the UUID back to the frontend
            await self.send(json.dumps({"type": "uuid", "uuid": self.user_uuid}))
            
            words, guessing_words = get_words_to_init_game()
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "start_game",
                    "message": "Game has started!",
                    "player1": self.user_uuid,
                    "player2": self.opponent_uuid,
                    "words": words,
                    "guessing_words": guessing_words
                }
            )

        else:
            # No waiting player, so this player becomes the waiting player
            waiting_player = self.user_uuid
            self.opponent_uuid = None

            # Accept the connection and notify the player to wait
            await self.accept()
            await self.send(json.dumps({"type": "uuid", "uuid": self.user_uuid}))
            await self.send(json.dumps({"type": "waiting", "message": "Waiting for an opponent..."}))

            print(self.group_name)
            # Send the UUID back to the frontend





    async def disconnect(self, close_code):
        global waiting_player

        # If this player was waiting, reset the waiting player
        if waiting_player == self.user_uuid:
            waiting_player = None

        # Remove the player from the group if they are in one
        if hasattr(self, 'group_name') and self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)


    async def receive(self, text_data):
        print(text_data)
        # Ensure the player is in a group before processing messages
        if not self.group_name:
            await self.send(json.dumps({"type": "error", "message": "Waiting for an opponent..."}))
            return

        # Process incoming messages (e.g., game moves) and broadcast to the group
        data = json.loads(text_data)
        message_type = data.get("type", "")

        if message_type == "random_letter":
            word_index = data.get("word_index")
            random_index = data.get("random_index")
            next_turn = data.get("next_turn")

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "random_letter",
                    "word_index": word_index,
                    "random_index": random_index,
                    "next_turn": next_turn,
                    "uuid": self.user_uuid
                }
            )
            
        elif message_type == "chosen_word_letter":
            word_index = data.get("word_index")
            random_index = data.get("random_index")
            next_turn = data.get("next_turn")
            sender_point_change = data.get("sender_point_change")

            
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chosen_word_letter",
                    "word_index": word_index,
                    "random_index": random_index,
                    "next_turn": next_turn,
                    "sender_point_change": sender_point_change,
                    "uuid": self.user_uuid
                }
            )

        elif message_type == "guess_word":
            word_index = data.get("word_index")
            right = data.get("right")
            guess = data.get("guess")
            next_turn = data.get("next_turn")
            sender_point_change = data.get("sender_point_change")

            if right:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "guess_word_right",
                        "word_index": word_index,
                        "guess": guess,
                        "next_turn": next_turn,
                        "sender_point_change": sender_point_change,
                        "uuid": self.user_uuid
                    }
                )

            else:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "guess_word_wrong",
                        "word_index": word_index,
                        "guess": guess,
                        "next_turn": next_turn,
                        "sender_point_change": sender_point_change,
                        "uuid": self.user_uuid
                    }
                )

        elif message_type == "accidentally_show_word":
            word_index = data.get("word_index")
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "accidentally_show_word",
                    "word_index": word_index,
                    "uuid": self.user_uuid
                }
            )


        else:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "game_message",
                    "message": data.get("message", ""),
                    "uuid": self.user_uuid
                }
            )

    async def game_message(self, event):
        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "uuid": event["uuid"]
        }))

    async def start_game(self, event):
        # Send the start game message to the WebSocket
        await self.send(json.dumps({
            "type": "start_game",
            "message": event["message"],
            "player1": event["player1"],
            "player2": event["player2"],
            "words": event["words"],
            "guessing_words": event["guessing_words"]
        }))

    async def random_letter(self, event):
        # Forward the message to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "random_letter",
            "word_index": event["word_index"],
            "random_index": event["random_index"],
            "next_turn": event["next_turn"],
            "uuid": event["uuid"],  # Include the sender's UUID
        }))

    async def chosen_word_letter(self, event):
        # Forward the message to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "chosen_word_letter",
            "word_index": event["word_index"],
            "random_index": event["random_index"],
            "next_turn": event["next_turn"],
            "sender_point_change": event["sender_point_change"],
            "uuid": event["uuid"],  # Include the sender's UUID
        }))

    async def guess_word_right(self, event):
        # Forward the message to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "guess_word_right",
            "word_index": event["word_index"],
            "guess": event["guess"],
            "next_turn": event["next_turn"],
            "sender_point_change": event["sender_point_change"],
            "uuid": event["uuid"],  # Include the sender's UUID
        }))

    async def guess_word_wrong(self, event):
        # Forward the message to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "guess_word_wrong",
            "word_index": event["word_index"],
            "guess": event["guess"],
            "next_turn": event["next_turn"],
            "sender_point_change": event["sender_point_change"],
            "uuid": event["uuid"],  # Include the sender's UUID
        }))

    async def accidentally_show_word(self, event):
        # Forward the message to the WebSocket
        await self.send(text_data=json.dumps({
            "type": "accidentally_show_word",
            "word_index": event["word_index"],
            "uuid": event["uuid"],  # Include the sender's UUID
        }))