# 🧠 MindWars AI - AI-Generated Quiz Contest Platform

**MindWars AI** is a dynamic, AI-powered quiz contest platform that allows users to **create, join, and compete** in intelligent, interactive quizzes. Unlike traditional systems relying on static question banks, MindWars AI leverages **Generative AI** to create quizzes in real-time, assess performance instantly, and provide **personalized feedback** for improvement.

Built using a modern full-stack architecture, MindWars AI empowers learners and quiz enthusiasts with a competitive, engaging, and insightful learning experience.

---

## 🚀 Key Features

* 🔐 **JWT Authentication** – Secure login/signup with hashed passwords using `bcrypt` and token-based session management.
* 🧠 **AI-Generated Quizzes** – Quizzes are dynamically created using **Gemini AI** via Educhain based on topic, difficulty, and number of questions.
* 📝 **Custom Battle Creation** – Users can set the topic, time, difficulty, and number of questions to host a quiz battle.
* 🎯 **Live Contest Participation** – Players can join any active contest and attempt time-bound questions.
* 📊 **Real-Time Leaderboard** – Rankings are calculated based on accuracy and time to foster competitiveness.
* 📚 **Personalized Feedback** – After submission, AI suggests a learning path tailored to the user’s weak areas.
* 💻 **Responsive Design** – Built with React.js and Tailwind CSS to offer a smooth user experience across devices.

---

## 🧩 Tech Stack

| Layer    | Tech Used                           |
| -------- | ----------------------------------- |
| Frontend | React.js, Tailwind CSS              |
| Backend  | Flask (Python), Flask-CORS, JWT     |
| AI Layer | Google Gemini + Educhain            |
| Database | MongoDB (users, quizzes, responses) |
| Hosting  | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
MindWarsAI/
├── frontend/              # React + Tailwind UI
├── backend/
│   ├── app.py            # Main Flask backend
│   ├── .env              # Environment variables
│   └── requirements.txt  # Python dependencies
└── README.md
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MindWarsAI.git
cd MindWarsAI
```

---

### 2. Frontend Setup (React.js)

```bash
cd frontend
npm install
npm run dev
```

> Frontend will typically run on `http://localhost:3000`

---

### 3. Backend Setup (Python + Flask)

```bash
cd ../backend
python -m venv env
# Activate virtual environment
# Windows
env\Scripts\activate
# macOS/Linux
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Create a `.env` File

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/<db_name>"
OPENAI_API_KEY="your-google-gemini-api-key"
SECRET_KEY="your-secret-key"
```

> Ensure your MongoDB database has two collections:
> * `users`
> * `quizzes`

Then start the backend:

```bash
flask run
```

> Backend will run on `http://localhost:5000` by default

---

### 4. Run the Application

Ensure both frontend and backend servers are running.

Visit:
🔗 `http://localhost:3000`

---

## 🧪 Database Overview [Logical View]

* **Users**

  * `username`, `email`, `password`
* **Quizzes**

  * `quiz_id`, `quiz_name`, `description`, `difficulty`, `time_limit`, `creator_username`, `created_at`, `deadline`
* **Questions**

  * `quiz_id`, `question`, `options`, `correct_answer`, `explanation`
* **Users Attempted**

  * `quiz_id`, `username`, `score`, `time_completion`, `personalized_feedback`

---

## 🧾 Use Case Flow

* **Sign Up / Login** → Register securely with hashed passwords.
* **Create Battle** → Enter quiz metadata → AI generates questions.
* **Join Battle** → Select available contest → Start timer.
* **Attempt Quiz** → Answer time-bound questions.
* **Submit Quiz** → Score calculated → AI generates learning path.
* **View Leaderboard** → Sorted rankings displayed for each contest.

---

## 🧠 Edge Case Handling

| Edge Case                      | Handling Strategy                 |
| ------------------------------ | --------------------------------- |
| Access without login           | Toast + redirect to login         |
| Invalid login credentials      | Return 401 Unauthorized           |
| JWT expired or missing         | Redirect + message                |
| Quiz not found                 | Return 404 with friendly UI       |
| Duplicate submission           | Block and notify user             |
| AI API timeout                 | Fallback message + error log      |
| Skipped questions              | Score based on attempted only     |
| Expired quiz attempt           | Block with "Quiz expired" message |
| Multiple attempts by same user | Check and prevent reattempt       |

---

## 🔮 Future Enhancements

* 📈 **User Dashboard** with history of attempts, scores, and feedback.
* 👥 **Real-Time Multi-Player Battles** with live countdown and rankings.
* 🔍 **Topic Categories & Filters** (e.g., Tech, Science, Current Affairs).
* 🛠 **Admin Panel** for quiz moderation and user management.

---

## 📚 References
* [Flask Docs](https://flask.palletsprojects.com/)
* [MongoDB Docs](https://www.mongodb.com/docs/)
* [React Docs](https://reactjs.org/)
* [Educhain + Gemini AI](https://ai.google.dev/)
* [Vercel Deployment](https://vercel.com/)
* [Render Deployment](https://render.com/)

---
### Enjoy the competitive, AI-powered quiz experience with **MindWars AI**! 🧠✨
