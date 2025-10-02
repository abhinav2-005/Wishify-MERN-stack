# ✨ Wishify - Automated Wishing Platform

Wishify is a full-stack MERN application that allows users to manage a personalized list of friends and family to automate sending wishes for birthdays, anniversaries, and other special occasions.

## 🚀 Features

* **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
* **Personalized Dashboards**: Each user has their own private wishing list.
* **CRUD Operations**: Users can Create, Read, Update, and Delete entries in their wish list.
* **Protected Routes**: Backend API endpoints are protected to ensure users can only access their own data.
* **Responsive UI**: A clean and simple user interface built with React.

## 🛠️ Tech Stack

This project is built with the MERN stack:

* **Frontend**:
    * [**React.js**](https://reactjs.org/) - A JavaScript library for building user interfaces.
    * [**React Router**](https://reactrouter.com/) - For client-side routing.
* **Backend**:
    * [**Node.js**](https://nodejs.org/) - JavaScript runtime environment.
    * [**Express.js**](https://expressjs.com/) - Web framework for Node.js.
    * [**MongoDB**](https://www.mongodb.com/) - NoSQL database for storing user and wish data.
    * [**Mongoose**](https://mongoosejs.com/) - Object Data Modeling (ODM) library for MongoDB.
    * [**JSON Web Token (JWT)**](https://jwt.io/) - For secure user authentication.
    * [**bcrypt.js**](https://www.npmjs.com/package/bcrypt) - For hashing user passwords.

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v16 or later recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [MongoDB](https://www.mongodb.com/try/download/community) (make sure the MongoDB server is running on your machine)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/wishify-mernstack.git](https://github.com/your-username/wishify-mernstack.git)
    cd wishify-mernstack
    ```

2.  **Set up the Backend:**
    ```bash
    # Navigate to the backend directory
    cd back_end

    # Install dependencies
    npm install

    # Create a .env file in the back_end directory
    # and add the following environment variables:
    ```
    Create a file named `.env` and add the following content:
    ```env
    # .env
    MONGO_URI=mongodb://127.0.0.1:27017/wishify_db
    JWT_SECRET=your_super_secret_key_that_is_long_and_random
    PORT=5000
    ```
    *Replace `your_super_secret_key...` with a long, random string.*

    ```bash
    # Start the backend server
    node server.js
    ```
    Your backend should now be running on `http://localhost:5000`.

3.  **Set up the Frontend:**
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd front_end

    # Install dependencies
    npm install

    # Start the React development server
    npm start
    ```
    Your frontend should now be running on `http://localhost:3000` and will connect to your backend.

## 📝 API Endpoints

The following are the main API routes established in the backend:

| Method | Endpoint              | Description                      | Protected |
| :----- | :-------------------- | :------------------------------- | :-------- |
| `POST` | `/api/users/signup`   | Register a new user              | No        |
| `POST` | `/api/users/login`    | Log in a user and get a token    | No        |
| `GET`  | `/api/users/me`       | Get the logged-in user's details | Yes       |
| `GET`  | `/api/wishes`         | Get all wishes for the user      | Yes       |
| `POST` | `/api/wishes`         | Create a new wish for the user   | Yes       |
| `DELETE`| `/api/wishes/:id`     | Delete a specific wish           | Yes       |
