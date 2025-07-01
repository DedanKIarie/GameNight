# 🎲 BoardGameNight

BoardGameNight is a full-stack web application designed to help users organize and manage board game nights with friends. Users can browse a list of games, manage their own collection, create public or private game night events, and send invitations to friends.

This project demonstrates a complete PERN-stack application, featuring a React frontend that communicates with a Python/Flask API backend, all deployed on Render.

## 🚀 Live Links

**Frontend:** https://gamenight-tcpy.onrender.com/

**Backend API:** https://gamenight-backend-a56o.onrender.com/

**Please Note:** The backend is hosted on Render's free service. If it has been inactive, it may take 30-60 seconds to "wake up" and respond to the first request. Please be patient on the initial load!

## ✨ Features

- **User Authentication:** Secure user signup, login, and logout functionality. Sessions are maintained across browser restarts.

- **Friend Management:** Users can send, accept, and decline friend requests to build their social circle.

- **Game Browse:** View a list of available board games. Logged-in users can add new games to the public list.

- **Event Creation:** Host new game nights, setting them as either public (visible to all) or private (details hidden from non-invitees).

- **Invitation System:** Hosts can invite their friends to game nights. Invitees can then accept or decline these invitations.

- **Privacy Control:** Details for private events (like location and host) are automatically hidden from users who have not been invited and accepted.

## 💻 Tech Stack

- **Frontend:** React, React Router
- **Backend:** Python, Flask, Flask-RESTful
- **Database:**
  - Production (Render): PostgreSQL
  - Development (Local): SQLite
- **ORM / Migrations:** Flask-SQLAlchemy, Flask-Migrate
- **Authentication:** Flask-Bcrypt for password hashing, Flask sessions for state management.
- **Deployment:** Render

## 🛠️ Setup and Installation

To run this project on your local machine, please follow these steps.

### Prerequisites

- Python 3.8+
- Node.js and npm
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>/server
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the local database:
```bash
flask db upgrade
```

5. Seed the database with sample data (optional):
```bash
python seed.py
```

6. Run the Flask server:
```bash
python app.py
```

The backend will now be running on http://127.0.0.1:5555.

### Frontend Setup

1. Navigate to the client directory:
```bash
cd ../client 
```
(Assuming your React app is in a folder named client)

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will now be running on http://localhost:3000 and will be configured to communicate with your local backend.

## API Endpoints

A brief overview of the primary API endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Creates a new player account. |
| POST | `/login` | Logs a player in and creates a session. |
| DELETE | `/logout` | Logs a player out and destroys the session. |
| GET | `/check_session` | Checks if a user is currently logged in. |
| GET | `/games` | Gets a list of all games. |
| POST | `/games` | Adds a new game. |
| GET | `/gamenights` | Gets a list of all game nights. |
| POST | `/gamenights` | Creates a new game night. |
| POST | `/friend_requests` | Sends a friend request. |
| PATCH | `/friend_requests/<id>` | Accepts or declines a friend request. |
| POST | `/gamenight_invitations` | Sends a game night invitation. |
| PATCH | `/gamenight_invitations/<id>` | Accepts or declines a game night invitation. |

## ✍️ Author

Created by: [Dedan Kiarie]