// ---- Imports ----
const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// ---- App Setup ----
const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = "supersecretkey"; // secret for JWT

// ---- In-memory storage ----
let ships = [];
let currentId = 1;

// ---- Authentication Middleware ----
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// ---- Routes ----

// Login to get a token
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  // normally you'd check a database; here we just sign
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// GET all ships
app.get("/ships", (req, res) => {
  res.json(ships);
});

// GET a ship by ID
app.get("/ships/:id", (req, res) => {
  const ship = ships.find((s) => s.id === parseInt(req.params.id));
  if (!ship) return res.status(404).json({ error: "Ship not found" });
  res.json(ship);
});

// POST new ship (protected)
app.post(
  "/ships",
  authenticateToken,
  [
    body("name").isString().withMessage("Name must be a string"),
    body("captain").isString().withMessage("Captain must be a string"),
    body("captainEmail").isEmail().withMessage("Invalid email"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, captain, captainEmail } = req.body;
    const newShip = {
      id: currentId++,
      name,
      captain,
      captainEmail,
      createdAt: new Date(),
    };
    ships.push(newShip);
    res.status(201).json(newShip);
  }
);

// PUT update ship (protected)
app.put(
  "/ships/:id",
  authenticateToken,
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("captain").optional().isString().withMessage("Captain must be a string"),
    body("captainEmail").optional().isEmail().withMessage("Invalid email"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ship = ships.find((s) => s.id === parseInt(req.params.id));
    if (!ship) return res.status(404).json({ error: "Ship not found" });

    const { name, captain, captainEmail } = req.body;
    if (name) ship.name = name;
    if (captain) ship.captain = captain;
    if (captainEmail) ship.captainEmail = captainEmail;

    res.json(ship);
  }
);

// DELETE ship (protected)
app.delete("/ships/:id", authenticateToken, (req, res) => {
  const shipIndex = ships.findIndex((s) => s.id === parseInt(req.params.id));
  if (shipIndex === -1) return res.status(404).json({ error: "Ship not found" });

  ships.splice(shipIndex, 1);
  res.json({ message: "Ship deleted" });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
