# ⚡ Thunderball Lottery Analyzer

A full-stack web application to analyze lottery results and generate smart tickets based on historical frequency.

## 🚀 Getting Started

### Prerequisites
- Node.js installed

### Installation & Running

1. **Start the Backend**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   The API will run at `http://localhost:5000`.

2. **Start the Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   open http://localhost:5173 to view the app.


## 🛠️ Stack
- **Backend**: Node.js, Express, Axios, Mongoose (MongoDB)
- **Frontend**: React, Vite, Recharts
- **Data**: MongoDB (Persistent Storage)

## 🔮 Features
- **Auto-Refresh**: Fetches latest data on startup.
- **Hot & Cold**: Identifies most/least frequent numbers.
- **Charts**: Visualizes frequency distribution.
- **Smart Generator**: Creates tickets using weighted probabilities.


---
## 🚢 Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions on:
1. Pushing to GitHub
2. Deploying to a VPS (Ubuntu)
3. Setting up PM2 and Nginx
4. Managing Data Persistence

