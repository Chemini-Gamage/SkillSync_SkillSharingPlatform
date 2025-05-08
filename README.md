# SkillSync

SkillShare is a collaborative project featuring a skill-sharing platform built using a modern tech stack. This includes a Spring Boot backend with MongoDB, and a React frontend integrated with Firebase for authentication, storage, and real-time data handling.

---

## 🔧 Prerequisites Before Running the Project

### 🧠 General Steps
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-repo/skillshare.git
   ```

---

### 📦 Backend Setup (Spring Boot + MongoDB)

1. **MongoDB Configuration**:
   - Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
   - Set up a cluster and create a database.
   - Add your cluster’s URI in the `application.yml` or environment variables.

2. **Environment Configuration**:
   - Inside the `backend` directory, create the following files:
     - `application.yml`
     - `application-dev.yml`
     - `application-prod.yml`
   - Include all necessary environment variables such as:
     - MongoDB URI
     - Token key paths (see below)
   - Example key paths:
     ```yaml
     access-token:
       private: ${ACCESS_TOKEN_PRIVATE_KEY_PATH}
       public: ${ACCESS_TOKEN_PUBLIC_KEY_PATH}
     refresh-token:
       private: ${REFRESH_TOKEN_PRIVATE_KEY_PATH}
       public: ${REFRESH_TOKEN_PUBLIC_KEY_PATH}
     ```

3. **Token Files**:
   - Generate the following keys and place them in a secure directory (e.g., `access-refresh-token-keys/`):
     - `access-token-private.key`
     - `access-token-public.key`
     - `refresh-token-private.key`
     - `refresh-token-public.key`

4. **Running the Backend**:
   - Open the project in VS Code.
   - Run `BackendApplication.java` to start the server.
   - Ensure port `8081` (or configured port) is free.

---

### 🌐 Frontend Setup (React + Firebase)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Firebase Configuration**:
   - Create a [Firebase project](https://console.firebase.google.com).
   - Enable Firestore, Authentication, and Storage.
   - In your `firebase.config.js`, set the Firebase credentials:
     ```js
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       ...
     };
     ```

3. **Running the Frontend**:
   ```bash
   npm start
   ```

---

## 📁 .gitignore and Sensitive Files

These files and directories are ignored for security and consistency:
```
# Backend
/backend/application*.yml
/backend/access-refresh-token-keys/

# Frontend
/frontend/node_modules/
/frontend/.env
/frontend/firebase.config.js
```

---


## 📄 License
This project is for educational purposes.
