# 🚢 Ships API  

A simple RESTful API built with **Node.js + Express** for managing ships.  
Supports JWT authentication, input validation, and Postman testing.  

---

## 📦 Requirements  

- Node.js (v16+ recommended)  
- npm  

---

## ⚙️ Setup  

bash
# Install dependencies
npm install

# Start server
node server.js
Server will run on:
👉 http://localhost:3000

🔐 Authentication
Before using the API, you must login to get a JWT token.

POST /login
Request body:

json
Copy code
{
  "username": "ayush",
  "password": "password123"
}
Response:

json
Copy code
{
  "token": "<your-jwt-token>"
}
The token will expire in 1 hour.

📌 Endpoints

1. GET /ships
Fetch all ships.
Auth required → Bearer Token.

2. POST /ships
Add a new ship.
Auth required → Bearer Token.

Example body:

json
Copy code
{
  "name": "Titanic",
  "captain": "John Smith",
  "captainEmail": "john@example.com"
}

3. GET /ships/:id
Fetch a ship by ID.
Auth required → Bearer Token.

4. PUT /ships/:id
Update a ship by ID.
Auth required → Bearer Token.

Example body:

json
Copy code
{
  "name": "Updated Titanic",
  "captain": "Jack Dawson",
  "captainEmail": "jack@example.com"
}

5. DELETE /ships/:id
Delete a ship by ID.
Auth required → Bearer Token.

-->Postman Setup
Import ships-api.postman_collection.json into Postman.

Run Login request → token auto-saved into jwtToken variable.

All other requests will use the token automatically.

✅ Test Cases Implemented
GET /ships → returns 200 OK with list of ships.

POST /ships → returns 201 Created when a ship is added.

GET /ships/:id → returns 404 Not Found for non-existing ship.

PUT /ships/:id → returns 200 OK when ship is updated.

DELETE /ships/:id → returns 200 OK when ship is deleted.


Built as part of REST API + Postman assignment.
