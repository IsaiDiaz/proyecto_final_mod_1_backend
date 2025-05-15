
# 🔧 Do-it Backend

This is the backend application for **Do-it**, providing a RESTful API for task management functionalities. Built with Express.js and Sequelize, it handles data operations, authentication, and business logic.

---

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT.
- **Task CRUD Operations**: Create, read, update, and delete tasks.
- **Filtering & Search**: Retrieve tasks based on status, keywords, and date ranges.
- **Data Validation**: Ensures data integrity and security.

---

## 🛠️ Tech Stack

- **Express.js**: Web framework for Node.js.
- **Sequelize**: Promise-based ORM for Node.js.
- **PostgreSQL**: Relational database system.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Library for hashing passwords.
- **dotenv**: Loads environment variables from a `.env` file.
- **cors**: Enables Cross-Origin Resource Sharing.

---

## 🧑‍💻 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** (Ensure it's installed and running)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/IsaiDiaz/proyecto_final_mod_1_backend
   cd proyecto_final_mod_1_backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the root directory and add the following updating values to yours:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=do_it_db
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   DB_DIALECT=dialect_of_your_database
   DB_PROD_DIALECT=dialect_of_your_database_in_production
   DB_PROD_NAME=database
   FRONTEND_URL=http://localhost:5173
   PGDATABASE=database
   PGHOST=host_of_your_database
   PGPASSWORD=password
   PGUSER=user
   ```

4. **Set up the database**:

   Ensure PostgreSQL is running and the database specified in `DB_NAME` exists.

5. **Run migrations**:

   *Note: If using Sequelize CLI, run the migrations. Otherwise, ensure models are synced appropriately.*

6. **Start the server**:

   ```bash
   node app.js
   ```

   The API will be available at `http://localhost:3000`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
