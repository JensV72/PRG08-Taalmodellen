# ChefPrompt

Welkom bij **ChefPrompt** – jouw persoonlijke AI-keukenhulp!

ChefPrompt is een slimme webapp die studenten helpt om snel en eenvoudig recepten te vinden op basis van wat je in huis hebt, hoe veel tijd je hebt, of waar je trek in hebt. Geen inspiratie? Geen probleem. Met behulp van taalmodellen stelt ChefPrompt passende recepten voor, speciaal afgestemd op jouw situatie.

Of je nu een beginner bent in de keuken of gewoon weinig tijd hebt: ChefPrompt denkt met je mee. Geef een paar ingrediënten door of een korte omschrijving van wat je zoekt, en laat de AI met ideeën komen!

**Gemaakt voor studenten. Werkt als een chef.**

## Installatie-instructies

Volg deze stappen om het project lokaal te draaien:

### 1. Repository clonen

```bash
git clone https://github.com/JensV72/PRG08-Taalmodellen
cd PRG08-Taalmodellen
```

### 2. Client starten

```bash
cd client
npm install
npm run dev
```

> Dit start de client. In de terminal verschijnt een link (meestal `http://localhost:5173`) — open deze in je browser zodra alle servers draaien.

### 3. Server starten (answer-service)

Open een **nieuwe terminal**, en voer uit:

```bash
cd PRG08-Taalmodellen/server
npm install
npm run answer
```

### 4. Server starten (ask-service)

Open opnieuw een **nieuwe terminal**, en voer uit:

```bash
cd PRG08-Taalmodellen/server
npm run ask
```

### 5. Applicatie gebruiken

Ga naar de link die je kreeg bij het draaien van `npm run dev` in de client (bijv. `http://localhost:5173`) om de applicatie te gebruiken.

---


