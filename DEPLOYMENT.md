# Deployment & GitHub Guide

This guide covers how to push your **Thunderball Analyzer** to GitHub and deploy it to a live server (VPS like DigitalOcean, Linode, AWS EC2, or Hetzner).

## Part 1: GitHub Setup

1.  **Initialize Git** (if not already done):
    Open your terminal in the project root (`d:\Antigravity`):
    ```bash
    git init
    ```

2.  **Commit Your Code**:
    ```bash
    git add .
    git commit -m "Initial commit - Thunderball Analyzer App"
    ```

3.  **Push to GitHub**:
    *   Go to [GitHub.com](https://github.com) and create a new repository.
    *   Follow the instructions to push an existing repository:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Part 2: Deployment (Ubuntu VPS)

Since this app saves data to a local file (`data/lottery-data.json`), it requires a server with a persistent filesystem. A VPS (Virtual Private Server) is the best choice.

### Prerequisites
*   A server running Ubuntu 20.04 or 22.04.
*   SSH access to the server.

### 1. Setup the Server Environment
SSH into your server and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (via NVM or direct)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Process Manager (PM2) to keep the app running
sudo npm install -g pm2
```

### 2. Clone and Setup Project
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 3. Backend Setup
```bash
cd backend
npm install

# Start Backend with PM2
pm2 start server.js --name "thunderball-api"
```

### 4. Frontend Setup
We will build the React app and serve it. For high performance, we'll let Nginx serve the static files, but for simplicity, you can also serve it via a simple Node server or just build it and configure Nginx.

**Option A: Build and Serve with Nginx (Recommended)**

1.  **Build Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run build
    ```
    This creates a `dist` folder.

2.  **Install Nginx**:
    ```bash
    sudo apt install nginx -y
    ```

3.  **Configure Nginx**:
    Create a config file: `sudo nano /etc/nginx/sites-available/thunderball`

    ```nginx
    server {
        listen 80;
        server_name your_domain_or_IP;

        # Serve Frontend (React)
        location / {
            root /path/to/your/repo/frontend/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # Proxy Backend API
        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/thunderball /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

### 5. Finalize
*   Access your IP/Domain in the browser.
*   The "Refresh Data" button will populate the JSON file on the server.

---

## Part 3: Alternative (Render/Railway)
If you prefer "Platform as a Service" (easier than VPS):

1.  **Render.com**:
    *   Create a **Web Service**.
    *   Connect GitHub Repo.
    *   **Backend**: 
        *   Root Directory: `backend`
        *   Build Command: `npm install`
        *   Start Command: `node server.js`
        *   **Crucial**: You must attach a **Disk** to `/backend/data` so your lottery data survives restarts.
    *   **Frontend**:
        *   Create a separate **Static Site**.
        *   Root Directory: `frontend`
        *   Build Command: `npm run build`
        *   Publish Directory: `dist`
        *   **Rewrite Rule**: Source `/*`, Destination `/index.html`.

---

## Part 4: Vercel & MongoDB

**Can I deploy on Vercel?**
*   **Frontend**: YES.
*   **Backend**: YES (now that we use MongoDB).

**Prerequisites:**
1.  **MongoDB Atlas Account**: Create a cluster and get your connection string.
2.  **Environment Variables**:
    *   Set `MONGO_URI` in your Vercel project settings (or `.env` locally).

**Steps:**
1.  **Push to GitHub**.
2.  **Import to Vercel**:
    *   Select your repository.
    *   **Root Directory**: Leave as `./` (Root).
    *   **Framework Preset**: Other (or let it auto-detect).
    *   **Environment Variables**: Add `MONGO_URI`.
3.  **Deploy**: Vercel will use `vercel.json` to build both Backend and Frontend.

**Configuration Added:**
*   `vercel.json`: Configures the project as a monorepo (Frontend + Backend).
*   `backend/package.json`: Added `start` script.
*   `backend/server.js`: Exported for serverless execution.

