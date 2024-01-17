#  Project Documentation

## Project Overview

This Node.js project is designed to provide user authentication functionality, including user registration, login, forgot password, and password reset. The project structure is organized into different folders to maintain a clean and modular codebase.


### `index.js`

The main entry point of the application where the server is initialized, and routes are defined.

### `config/`

The `config` folder contains configuration of Database.

- **`db_config.js`**: This file includes the configuration settings for connecting to the database. It typically contains information such as database URL, username, password, and other relevant options.

### `models/`

The `models` folder contains files responsible for defining and creating tables in the database.

- **`user.js`**: This file defines the User model, which corresponds to the user table in the database. It includes details such as the user's username, email, hashed password, and any other relevant fields.

### `middleware/`

The `middleware` folder contains the authentication middleware responsible for authenticating tokens and checking request authorization.

- **`authenticate.js`**: This middleware authenticates user tokens and checks if the request is authorized. It is applied to specific routes that require authentication.

### `controllers/`

The `controllers` folder contains the authentication controller file responsible for handling user-related actions, such as login, registration, and password management.

- **`authController.js`**: This file includes functions for user registration (`register`), user login (`login`), forgot password (`forgotPassword`), and password reset (`resetPassword`). It interacts with the database and communicates with the client.


### `helpers/`

The `helpers` folder contains utility functions that can be used across different parts of the application.

- **`commonHelper.js`**: This file includes common helper functions that are used in multiple places within the application. It may include functions for handling errors, formatting data, or other general-purpose tasks.


### `package.json`

The package file containing project metadata, dependencies, and scripts.

### `README.md`

The project documentation file providing an overview of the project, installation instructions, and usage examples.

## Getting Started

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Configure the database: Update the `env` file with your database credentials.
4. Run the application: `npm start`

## Usage

- The API routes for authentication are defined in `routes/AuthRoutes.js`.
- Database configuration is in `config/db_config.js`.
- Common helper functions are in `helpers/commonHelper.js`.

Feel free to explore the codebase and modify it according to your requirements.



