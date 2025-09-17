# Campus EventHub - Team 2

Welcome to the **Campus EventHub** project! This platform is designed to streamline communication about college events, workshops, and activities. Teachers can post events easily, and students get notifications based on their interests, ensuring they never miss important events.

---

## 🚀 Features

### For Admin:
- **Secure Login:** Admin can log in securely to manage events.
- **Event Management:** Add, edit, and delete events with details like title, description, date, time, venue, and category.
- **Categorization:** Tag events (e.g., technical, cultural, sports) for easy organization.

### For Students:
- **Personalized Profiles:** Set interests to receive notifications relevant to you.
- **Event Notifications:** Receive updates for events that match your interests.
- **Event Browsing:** Explore all upcoming events on campus.

---

## 🛠️ Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS

---

## 📁 Project Structure
```pgsql
campus-eventhub-team2/
├── backend/ # Backend server code
├── frontend/ # Frontend React application
├── public/ # Public assets
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```
## ⚙️ Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/springboardmentor1317s-hub/campus-eventhub-team2.git
   cd campus-eventhub-team2
   ```
   2.Set up the backend:
    ```bash
     cd backend
     npm install
   ```
   Create a .env file in the backend folder:
   ```ini
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
   ```
   3.Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

   ##Run the application:

     Start backend server:
     ```
       cd ../backend
       npm start
     ```

     Start frontend server:
     ```
       cd ../frontend
       npm start
     ```
   ##🧪 Running Tests

   Frontend Tests:
   ```
     cd frontend
     npm test
   ```

   Backend Tests:
   ```
     cd backend
     npm test
   ```
   📄 License

   This project is licensed under the MIT License - see the LICENSE
    file for details.
