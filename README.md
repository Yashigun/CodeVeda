# MediMate
### MediMate is an AI-powered medical assistant that helps users check symptoms, get guidance, and navigate their health journey through a friendly chatbot interface.
---
## Features
- AI-powered chatbot for symptom checking
- Add more...
---
## Project Structure

---
### Installation

Backend (ChatBot):
```
cd MediMateBot/server
npm install
```
Frontend (ChatBot):
```
cd MediMateBot/client
npm install
```
Frontend (Main):
```
cd frontend
npm install
```

### Add your API key
Create a .env file inside /server with:
```
GEMINI_API_KEY=your_google_api_key_here
```
### Running the Project
Chatbot:
Start Backend:
```
cd MediMateBot/server
node server.js
```
Backend will run at: http://localhost:8080
Start the frontend:
```
cd MediMateBot/client
npm run dev
```
Start Main Frontend:
```
cd frontend
npm run dev
```
Open the printed local URL in your browser.


