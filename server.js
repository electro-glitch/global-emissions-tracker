const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // For handling JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username", // Replace with your MySQL username
  password: "your_password", // Replace with your MySQL password
  database: "your_database_name", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database!");
});

// 🔹 API Endpoint to Get Emissions Data by Country
app.get("/emissions/:country", (req, res) => {
  const country = req.params.country;
  const query = `
    SELECT year, CO2, CH4, N2O, F_Gas 
    FROM table7 
    WHERE country_name = ?
    ORDER BY year;
  `;

  db.query(query, [country], (err, results) => {
    if (err) {
      console.error("Error retrieving data:", err);
      res.status(500).send("Error retrieving data");
      return;
    }
    res.json(results);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
