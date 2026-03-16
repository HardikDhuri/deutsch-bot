# 🇩🇪 Deutsch Üben — Discord Bot

A free German language practice bot with translation, vocabulary quizzes, grammar correction, and daily word of the day.

---

## ✅ Free APIs Used (no credit card needed)

| Feature | API | Limit |
|---|---|---|
| `/translate` | MyMemory | 5,000 chars/day |
| `/correct` | LanguageTool | 20 req/min |
| `/quiz` | Built-in word bank | Unlimited |
| `/wort` | Built-in curated list | Unlimited |

---

## 🚀 Setup Guide

### Step 1 — Create your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it "Deutsch Üben"
3. Go to **Bot** tab → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy it (you'll need this)
5. Scroll down, enable **"Message Content Intent"** (for future features)
6. Go to **OAuth2 → URL Generator**:
   - Scopes: ✅ `bot` + ✅ `applications.commands`
   - Bot Permissions: ✅ `Send Messages`, ✅ `Embed Links`, ✅ `Read Message History`
7. Copy the generated URL and open it to invite the bot to your server

### Step 2 — Get your Client ID

- In the Developer Portal, go to **General Information**
- Copy the **Application ID** — this is your `CLIENT_ID`

### Step 3 — Set up the project locally

```bash
git clone <your-repo>
cd deutsch-uben-bot
npm install
cp .env.example .env
```

Edit `.env` and fill in:
```
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id_here
WORT_CHANNEL_ID=your_channel_id_here  # optional
```

### Step 4 — Register slash commands

```bash
npm run deploy
```

You should see: `✅ Slash commands registered!`

### Step 5 — Test locally

```bash
npm start
```

Try `/translate hello` in your Discord server. If it works, you're ready to deploy!

---

## 🚂 Deploy to Railway (Free)

1. Push your code to a GitHub repo (make sure `.env` is in `.gitignore` ✅)
2. Go to https://railway.app and sign up with GitHub
3. Click **New Project → Deploy from GitHub repo**
4. Select your repo
5. Go to your project → **Variables** tab and add:
   ```
   DISCORD_TOKEN = your_token
   CLIENT_ID     = your_client_id
   WORT_CHANNEL_ID = your_channel_id
   ```
6. Railway will auto-deploy. Your bot will be online 24/7!

> **Railway free tier**: $5 credit/month — plenty for a Discord bot (uses ~$0.50/month)

---

## 📋 Commands

| Command | Description |
|---|---|
| `/translate [text]` | Translate English → German with gender hints |
| `/quiz [level]` | Vocabulary quiz at A1/A2/B1/B2 |
| `/wort` | Today's word of the day |
| `/correct [sentence]` | Grammar check your German sentence |

---

## ➕ Extending the Word Bank

Add more quiz words in `commands/quiz.js` under the appropriate level:

```js
{ en: 'the butterfly', de: 'der Schmetterling', wrong: ['die Schmetterling', 'das Schmetterling', 'der Falter'] },
```

Add more daily words in `commands/wort.js` in the `WORDS_OF_DAY` array.

---

## 🛠️ Tech Stack

- **discord.js** v14 — bot framework
- **MyMemory API** — free translation (no key needed)
- **LanguageTool API** — free grammar checking (no key needed)
- **Railway** — free hosting
