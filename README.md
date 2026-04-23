# gym-management-system
Full-stack Gym Management System (Angular + Express) for managing members, subscriptions, and gym operations.

his project is a simple **Gym Management System** with an **AdminRoutes login system** built with Node.js, Express, MongoDB, and Angular frontend.

---

## **Features**

- AdminRoutes registration and login
- Password hashing with bcrypt
- JWT authentication for protected routes
- Dashboard access for authenticated admins

---

## **Backend**

### **Tech Stack**
- Node.js
- Express
- MongoDB (Mongoose)
- bcrypt for password hashing
- JSON Web Tokens (JWT) for authentication

### **Setup**
1. Clone the repository:
```bash 
git clone <repo-url>
 
```
### **Install Dependencies**
cd backend
npm install

### **Start MongoDB (local)**
# if installed locally
mongod

### Create .env file (optional, for secret keys and DB URL):
MONGO_URL=mongodb://127.0.0.1:27017/gymDB
JWT_SECRET=yourSecretKey
PORT=3000

### Start backend server:
node server.js or npm run dev

### Frontend
Tech Stack
Angular
RxJS
Angular Material / Bootstrap (if used)
Setup
Go to frontend folder:

# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start Angular app
ng serve

# 4. Access the app
# Open in browser at:
http://localhost:4200
