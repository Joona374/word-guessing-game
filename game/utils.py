import random

WORDS = [    
    "KOTI",
    "KOULU",
    "AUTO",
    "VENE",
    "TALO",
    "KISSA",
    "KOIRA",
    "PUU",
    "KIRJA",
    "SÄNKY",
    "PÖYTÄ",
    "TUOLI",
    "LASI",
    "LAIVA",
    "JUNA",
    "SILTA",
    "PUISTO",
    "KAUPPA",
    "RUOKA",
    "KEITTIÖ",
    "KIRKKO",
    "LAMPPU",
    "PENKKI",
    "KYLPY",
    "VARASTO",
    "TORI",
    "JÄÄKAAPPI",
    "PARVEKE",
    "KORTTI",
    "OVIKELLO",
    "PYYHE",
    "POTKURI",
    "PORTTI",
    "KAASU",
    "VALOT",
    "PEILI",
    "ASTIA",
    "LUOKKA",
    "PORKKANA", 
    'TIETOKONE',
    'PESÄ',
    'LUOLA',
    'KIVI',
    'KYNTTILÄ',
    'KUKKA',
    'METSO',
    'TUKKA',
    'KULHO',
    'KUKKARO',
    'TAPETTI',
    'VERHO',
    'TUULI',
    'JÄÄ',
    'HIUS',
    'KUU',
    'TYÖ',
    'SUOMI',
    'SANKARI',
    'SUKLA',
    'VILJA',
    "RANNIKKO", "PUUTARHA", "PALOASEMA", "KIRJASTO", "ELÄINTARHA", "PLANEETTA", "KEITTOKIRJA", "HIIHTOLOMA", "KALLIO", "VESITORNI", "RAKENNUS", "VILJAPELTO", "SÄHKÖPOSTI", "KUVATAIDE", "MATKUSTUS", "JÄÄTIKKÖ", "KALASTUS", "METALLI", "POLKUPYÖRÄ", "PÄIVÄKOTI", "LUONNONPUISTO",
    "MERIMAILI", "PUOLUKKA", "SYYSTAKKI", "KARVIAINEN", "SUOLAKIVI", "LUMIPALLO", "SATAMA", "KAMPAUS", "KIRPPUTORI", "POLTTOPUU", "METSÄPOLKU", "VESILINTU", "KARJATILA", "ALMANAKKA", "KUULUTUS", "VILJELY", "KIRJOITUS", "KEVÄTKUKKA", "VALOVOIMA", "VESIPUTOUS", "LÄHIÖ", "VASTATUULI", "PILVILINNA", "SCREENSHOT", "PEHMUSTEET", "HÄLYTYS", "HIRSITALO", "LUKULAMPPU", "KIRJALLISUUS", "HUVIPUISTO", "JOULULOMA", "PUULASTU", "RUOKALISTA",
    "KIRKONKYLÄ", "SÄHKÖLINJA", "MAANTIE", "HIUSKAMPA", "VETOKETJU", "HONKA", "VALTATIE", "LUOMUTUOTE", "KULTASEPPÄ", "PURJEVENE", "LUMIAURA", "MAKUPALA", "KASVIHUONE", "UIMARANTA", "KELKKAILU", "SYYSLOMA", "ILMAPALLO", "JÄÄKIEKKO", "KOTIMATKA", "KOULUMATKA", "LOUNASAIKA", "KESÄPÄIVÄ", "LASKETTELU", "JÄÄVUORI", "PIHATYÖT", "RISTEILIJÄ", "SÄHKÖPOSTI", "SATAMA", "RAKENNUS", "KESÄMÖKKI", "KOULURUOKA", "UUTISKIRJE", "TAIDEMUSEO", "VALOKUVAUS", "TÄHTITIEDE", "VESIJOHTO", "JUHLAPUHE", "ILMASTO", "KIVITALO", "LUMITYKKI", "PIHA", "METSÄPOLKU", "KIRJAHYLLY", "LUMIKINNOS", "UIMAHYPPY" , "LAMMAS", "ELEFANTTI", "SAUNAILTA", "AAVIKKO", "SAIRAALA"]

def get_words_to_init_game():
    words_to_return = []
    guessing_words_to_return = []

    for _ in range(5):
        i = random.randint(0, len(WORDS) - 1)
        words_to_return.append(WORDS[i])
    
    for i in range(5):
        while True:
            word = words_to_return[i]
            guessing_word = ""

            guessing_letters = 0
            for letter in word:
                if random.randint(1, 10) < 3:
                    guessing_word += letter
                    guessing_letters += 1
                else:
                    guessing_word += "-"
            
            if guessing_letters < len(word) - 2:
                guessing_words_to_return.append(guessing_word)
                break

    return (words_to_return, guessing_words_to_return)
