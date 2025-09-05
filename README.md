<div align="center">
  
# MediMate
  <img width="350" alt="image" src="https://github.com/user-attachments/assets/98653ea2-cff2-4015-9158-dfcaaf46f031" />
</div>

### MediMate is an AI-powered medical assistant that helps users check symptoms, get guidance, and navigate their health journey through a friendly chatbot interface.
---
## Features
- **AI-powered Chatbot for Symptom Checking**  
  - Built using **Google’s Gemini API** for natural, context-aware medical conversations  
  - Analyzes user-reported symptoms and provides responses in a structured format:  
    **Severity**, **Immediate Need for Attention**, **See a Doctor If**, **Next Steps**, **Possible Conditions**  
  - Helps users decide whether they can manage symptoms at home or need to consult a healthcare professional  

- **Nearby Hospitals & Pharmacies**  
  - Interactive map powered by **OpenStreetMap & Overpass API**  
  - Automatically detects your **approximate location** (via IP geolocation)  
  - Displays hospitals, clinics, and pharmacies within a **5 km radius**  
  - Includes a **legend and radius circle** for better clarity  
  - Falls back to prominent Delhi hospitals (AIIMS, Safdarjung, Apollo, Fortis, Apollo Pharmacy and MedPlus Pharmacy) if location detection fails
- **Emergency SOS Button**
  - Quick one-click emergency trigger from the navbar
  - Detects location via GPS or falls back to IP-based lookup
  - Shows a popup with confirmation and a Google Maps link
  - Auto-hides after a few seconds for smooth UX

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
Backend (Authentication):
```
cd auth/server
npm install
```
Frontend (Authentication):
```
cd auth/client
npm install
```
### Add your API key
Create a .env file inside /server of MediMateBot with:
```
GEMINI_API_KEY=your_google_api_key_here
```
Create a .env file inside /server of auth with:
```
PORT= 5000
MONGO_URI=your_mongoDB_URI
JWT_SECRET= your_jwt_secret_key
```
### Running the Project
Chatbot:
Start Backend:
```
cd MediMateBot/server
node server.js
```
Backend of Bot will run at: http://localhost:8080
Start the frontend:
```
cd MediMateBot/client
npm run dev
```
Authentication:
Start Backend:
```
cd auth/server
npm run dev
```
Backend of Authentication will run at: http://localhost:5000
Start the frontend:
```
cd auth/client
npm run dev
```
Start Main Frontend:
```
cd frontend
npm run dev
```
Open the printed local URL in your browser.









