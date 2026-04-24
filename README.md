# SkillSync - AI-Powered ATS Optimizer & Microservices Architecture

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/Harshitpant12/skillsync)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Microservice-Python_Flask-yellow)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-gray)](./LICENSE)

**SkillSync** is a full-stack SaaS application designed to calculate ATS (Applicant Tracking System) compatibility scores. It utilizes a decoupled microservices architecture, isolating a MERN-stack primary server from a dedicated Python NLP engine to process compute-heavy document parsing and cosine-similarity algorithms without blocking the main event loop.

---

## Live Demo

[**View Live Application**](https://skillsync-official.vercel.app)

---

## Key Features

* **Microservices Architecture:** Independently deployed Node.js REST API on Vercel and a Python/Flask NLP engine on Render for optimized CPU load balancing.
* **Advanced NLP Pipeline:** Leverages `pdfminer.six` for high-fidelity text extraction, utilizing `spaCy` and `scikit-learn` to calculate vector similarities between resumes and job descriptions in under 15 seconds.
* **Enterprise-Grade Authentication:** Built a robust JWT system with silent refresh interceptors and cross-domain HTTP-only cookies, utilizing Vercel edge rewrites to bypass strict browser tracking policies.
* **Client-Side PDF Generation:** Utilized native browser Print APIs to generate highlightable, vector-based PDF reports directly from the React DOM, bypassing server-side rendering constraints and reducing cloud computing costs.
* **Dynamic Client Dashboard:** Engineered a responsive React/Vite frontend using Tailwind CSS and Framer Motion, featuring drag-and-drop file uploads and real-time polling.
* **High-Performance Routing:** Load-tested using Apache JMeter, optimizing CORS configurations and payload routing to maintain sub-400ms average response times under concurrent loads.

---

## Tech Stack

### Frontend (Vercel)
* **React.js (Vite)**: Modern, component-based UI library.
* **Tailwind CSS**: Utility-first CSS framework for responsive design.
* **Framer Motion**: Declarative animation library for fluid UI state transitions.
* **Axios**: HTTP client with custom interceptors for automated JWT refresh cycles.

### Primary Backend (Vercel Serverless)
* **Node.js & Express.js**: RESTful API structured for serverless deployment.
* **MongoDB & Mongoose**: NoSQL database for storing user schemas and vector analysis history.
* **JWT**: Stateless authentication securely managed via `sameSite: lax` cookies.
* **Multer**: Memory storage middleware for handling binary PDF uploads.

### Python Service (Render)
* **Python (Flask)**: Lightweight WSGI web application framework.
* **spaCy**: Industrial-strength Natural Language Processing for entity recognition.
* **scikit-learn**: Machine learning library utilized for TF-IDF vectorization and cosine similarity calculations.
* **pdfminer.six**: High-precision PDF document text extraction.

---

## Architecture & Project Structure

The repository isolates the frontend client, the Node.js API, and the Python NLP engine into independent directories for scalable deployment.

```bash
skillsync/
├── backend/             # Node.js / Express Serverless API
│   ├── src/
│   │   ├── controllers/ # Request logic (auth, analysis processing)
│   │   ├── middleware/  # JWT validation, Multer config, error handling
│   │   ├── models/      # Mongoose schemas (User, AnalysisRecord)
│   │   ├── routes/      # API endpoints routing
│   │   ├── utils/       # DB connection, Axios instance for Python API
│   │   └── index.js     # App entry point (Trust Proxy & CORS configured)
│   └── .env             # Environment variables
├── frontend/            # React / Vite Client
│   ├── public/          
│   ├── src/
│   │   ├── api/         # Axios global config with token interceptors
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # AuthContext for global user state
│   │   ├── pages/       # Views (Dashboard, History, Results, Settings)
│   │   └── main.jsx     # React DOM render entry
│   └── vercel.json      # Reverse proxy rules for first-party cookies
└── python-service/      # Python / Flask Microservice
    ├── app.py           # Flask server and routing
    ├── ats_scorer.py    # Core scoring logic and TF-IDF vectorization
    ├── extractor.py     # pdfminer.six text extraction logic
    ├── matcher.py       # spaCy entity matching and similarity calculation
    ├── requirements.txt # Python dependencies
    └── skills_list.py   # Curated dictionary/dataset of technical skills

## Installation & Setup

Follow these steps to run the complete microservices architecture locally.

### Prerequisites

* **Node.js** (v18+)
* **Python** (v3.9+)
* **MongoDB** (Local instance or MongoDB Atlas URL)
* **Git**

### 1. Clone the Repository

```bash
git clone [https://github.com/Harshitpant12/skillsync.git](https://github.com/Harshitpant12/skillsync.git)
cd skillsync

### 2. Node.js Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
PYTHON_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

### 3. Python Service Setup

Open a new terminal, navigate to the `python-service` folder:

```bash
cd python-service
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Start the Flask server:

```bash
python app.py
```
*(The Python service runs on `http://localhost:5001`)*

### 4. Frontend Setup

Open a third terminal window, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` root folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the React development server:

```bash
npm run dev
```

---

## API Reference

### Analysis Routes (Node.js)

| Method | Endpoint | Description | Protected? |
| -------- | -------------------------- | -------------------------------------------- | :--------: |
| **POST** | `/api/analysis/run` | Forwards PDF/JD to Python service & saves results| Yes |
| **GET** | `/api/analysis/my` | Retrieves user's historical scan data | Yes |
| **GET** | `/api/analysis/wake-python`| Pre-flight ping to prevent cold-starts | Yes |

### Auth Routes (Node.js)

| Method | Endpoint | Description | Protected? |
| -------- | -------------------------- | -------------------------------------------- | :--------: |
| **POST** | `/api/auth/register` | Hash password & create user | No |
| **POST** | `/api/auth/login` | Authenticate & issue cross-domain HTTP-only cookies| No |
| **POST** | `/api/auth/refresh` | Silent access token regeneration via refresh cookie| No |
| **POST** | `/api/auth/logout` | Destroy secure session cookies | Yes |
| **GET** | `/api/auth/me` | Verify active session state | Yes |

---

## Contributing

Contributions are welcome!

1.  **Fork** the project.
2.  Create your **Feature Branch** (`git checkout -b feature/Optimization`).
3.  **Commit** your changes (`git commit -m 'Implement faster vectorization'`).
4.  **Push** to the Branch (`git push origin feature/Optimization`).
5.  Open a **Pull Request**.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.