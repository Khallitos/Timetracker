# Employee Time Tracking and Leave Request App

This is an **Employee Time Tracking and Leave Request Application** that helps employees track their work hours, handle vacation requests, and integrate with Google OAuth for authentication. The app features a work timer, vacation entry form, and functionalities like pause, play, and stop buttons.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
   - [Frontend Installation](#frontend-installation)
   - [Backend Installation](#backend-installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)
7. [Acknowledgements](#acknowledgements)

## Introduction

This project is an **Employee Time Tracking and Leave Request App** designed to help employees:

- Track their work hours with a timer (start, pause, and stop).
- Submit and manage vacation and leave requests.
- Authenticate via **Google OAuth** for secure login.

Built with **React** for the frontend, **Next.js** for server-side rendering, and **Node.js/Express** for the backend.

## Features

- **Google OAuth Authentication**: Secure sign-in using Google accounts.
- **Work Timer**: Start, pause, and stop a work timer that tracks employee hours.
- **Vacation Entry Form**: Employees can submit vacation or leave requests.
- **Work Hours Tracking**: Track and display total worked hours for the user.
- **Overtime Calculation**: Automatically detect and notify users when their worked hours exceed the set limit.

## Installation

### Frontend Installation

To set up the frontend of the project, follow the steps below:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/timetracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd timetracker
   ```

3. Install frontend dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables (use your actual keys):

   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_BASE_URL=your-api-url
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend Installation

To set up the backend server, follow these steps:

1. Navigate to the backend directory (or create it separately if you prefer):

   ```bash
   cd timetrackerserver
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Install both frontend and backend dependencies (optional, if you want to set up both together):

   ```bash
   npm run install-dependencies
   ```

4. Create a `.env` file in the backend directory and add the necessary environment variables:

   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

The backend will be running on [http://localhost:5000](http://localhost:5000) (or whatever port you configure in your `server.js`).

### Running Frontend and Backend Simultaneously

To run both the frontend and backend concurrently during development:

1. Run the following command in the backend directory:
   ```bash
   npm run install-dependencies
   ```

This will start both the frontend and backend servers using `concurrently`, with the frontend available at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:5000](http://localhost:5000).

## Usage

Once the application is running, users can:

- **Sign in with Google OAuth** for authentication.
- **Start the timer** by clicking the "Start" button to track work hours.
- **Pause or stop the timer** using the "Pause" and "Stop" buttons.
- Submit **vacation requests** through the vacation entry form.
- **View total worked hours** and **overtime** notifications.

```javascript
// Example code for starting the timer
const timer = new Timer();
timer.start();

Contributing
We welcome contributions to improve the project. To contribute:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to your branch (git push origin feature-name).
Open a pull request to the main repository.
Code of Conduct
Please adhere to our Code of Conduct while contributing.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements
Google OAuth: For authentication integration.
Material UI: For the user interface components.
React: The framework used to build the application.
Next.js: For server-side rendering and fast page loads.
Node.js/Express: For the backend API server.
MongoDB: For data storage.
AWS SDK: For file uploads (if used).
markdown
Copy code

---


---

### Key Adjustments Made:
- **Frontend and Backend Setup**: The installation steps for both the frontend and backend are clearly separated.
    - Frontend setup includes commands to install dependencies and start the Next.js server.
    - Backend setup includes installation of backend dependencies and starting the Express server.
- **Environment Variables**: Instructions for adding environment variables such as `GOOGLE_CLIENT_ID`, `JWT_SECRET`, and database connection strings are included.
- **Concurrent Running**: The `npm run install-dependencies` script for running both frontend and backend simultaneously is explained.

This **README.md** now covers both frontend and backend installation, usage, and setup for the **Employee Time Tracking and Leave Request App**. If you'd like any other modifications or have more details to add, let me know!






```
