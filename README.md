# AlloMedia: Delivery Platform Backend

## Overview

**AlloMedia** is a backend system for a modern delivery platform built using the **MERN stack** (MongoDB, Express.js, and Node.js). This backend handles secure user authentication, profile management, and password reset functionality. The system is designed to provide a robust and scalable API for user management within the delivery platform.

## Features

- **User Registration & Authentication**:
  - Secure user registration with email and password.
  - Login functionality with **JWT-based authentication**.
  - Password hashing using **bcrypt** for added security.

- **Password Reset**:
  - Users can request a password reset link, sent to their registered email.
  - Token-based password reset for secure verification.

- **Profile Management**:
  - Users can update their profile information, including their username and email.

- **Session Handling**:
  - JWT-based token management, with support for token expiration and secure storage.
  
## Technology Stack

### Backend:
- **Node.js**: JavaScript runtime for executing server-side logic.
- **Express.js**: Framework for creating a RESTful API and routing requests.

### Database:
- **MongoDB**: NoSQL database used to store user information, tokens, and other app-related data.
  
### Other Key Libraries:
- **bcrypt.js**: Used for hashing user passwords before storing them in the database.
- **JWT (jsonwebtoken)**: For creating and managing secure authentication tokens.
- **Nodemailer**: To send password reset emails to users.
  
## Installation

### Prerequisites
Ensure the following are installed on your machine:
- **Node.js** (version 14 or higher)
- **MongoDB** (local instance or cloud-based)

### Steps

1. **Clone the Repository**:
   ```bash
   https://github.com/OSMaben/AlloMedia.git
   cd AlloMedia

2. **Install Project Dependencies**:
   ```bash
   npm install

3. **Set Up Environment Variables**:
  - Change content  of  `.env`.
  - Update the following fields in the `.env` file:
    ```bash
    MONGO_URI=mongodb://localhost:27017/allomedia
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    ```
5. **run  in terminal**:
   ```bash
    npm start

## API Endpoints

### Authentication

| HTTP Method | Endpoint                     | Description                                                   |
|-------------|------------------------------|---------------------------------------------------------------|
| POST        | `/api/register`              | Registers a new user.                                        |
| POST        | `/api/login`                 | Logs in the user and returns a JWT token.                   |
| POST        | `/api/reset-password`        | Sends a password reset link to the user's email.            |
| POST        | `/api/changePassword/:token` | Resets the user's password using a token.                   |


## Database Models

### User Model
The User model in MongoDB includes:

- **username**: Unique and required.
- **email**: Unique and validated for correct format.
- **password**: Hashed before storage using bcrypt.
- **Address**: Address of the  user.
- **Number**: Number of the  user.
- **isVerified**: Boolean indicating if the user's email is verified.
- **resetToken**: Token for password reset (optional).
- **resetTokenExpiry**: Expiry date for the reset token (optional).

## Contributing
Contributions are welcome! Feel free to fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
Special thanks to the AlloMedia team and the MERN Stack community for their continuous support.
