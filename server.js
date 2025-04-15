import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ishaan123",
  database: "ghg_emissions",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "guest") {
    return res.json({ success: true, role: "guest" });
  }
  if (username === "ishaan" && password === "ishaan123") {
    return res.json({ success: true, role: "admin" });
  }
  if (username === "tanay" && password === "tanay123") {
    return res.json({ success: true, role: "admin" });
  }
  if (username === "keshav" && password === "keshav123") {
    return res.json({ success: true, role: "admin" });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Countries endpoint
app.get("/api/countries", (req, res) => {
  const query = "SELECT DISTINCT country_name FROM gas_emissions ORDER BY country_name";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const countries = results.map((row) => row.country_name);
      res.json(countries);
    }
  });
});

// Sectors Above Average (Nested Subquery)

app.post("/api/nested/sectors-above-average", (req, res) => {
  const { country, year } = req.body;
    
  const query = `
  SELECT sector, year, \`Sector-wise Total Emissions\` AS emissions
  FROM sector_emissions
  WHERE country_name = ? 
    AND year = ?
    AND \`Sector-wise Total Emissions\` > (
      SELECT AVG(\`Sector-wise Total Emissions\`)
      FROM sector_emissions
      WHERE country_name = ? AND year = ?
    );
  `;

  
  connection.query(query, [country, year, country, year], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      console.log("Query results:", results);
      res.json(results);
    }
  });
});

// Years Above Average (Nested Subquery)

app.post("/api/nested/years-above-average", (req, res) => {
  const { country } = req.body;
  const query = `
    SELECT year, total_emissions
    FROM country_emissions
    WHERE total_emissions > (
      SELECT AVG(total_emissions) FROM country_emissions
    )
    AND country_name = ?;
  `;
  connection.query(query, [country], (err, results) => {
    err ? res.status(500).json({ error: "Database error" }) : res.json(results);
  });
});

// Emissions endpoint (gas and sector)
app.get("/api/emissions", (req, res) => {
  const { country, type, gas, startYear, endYear } = req.query;
  let query;
  let params = [country];

  if (type === "gas") {
    const validGasColumns = ["co2", "ch4", "n2o", "f_gas"];
    const gasColumn = gas?.toLowerCase().replace("-", "_");
    if (!validGasColumns.includes(gasColumn)) {
      return res.status(400).json({ error: "Invalid gas type" });
    }
    query = `SELECT year, ${gasColumn} AS emissions FROM gas_emissions WHERE country_name = ?`;
    if (startYear && endYear) {
      query += " AND year BETWEEN ? AND ?";
      params.push(Number(startYear), Number(endYear));
    }
  } else if (type === "sector") {
    query = `SELECT year, sector, \`Sector-wise Total Emissions\` AS emissions FROM sector_emissions WHERE country_name = ?`;
    if (startYear && endYear) {
      query += " AND year BETWEEN ? AND ?";
      params.push(Number(startYear), Number(endYear));
    }
  } else {
    return res.status(400).json({ error: "Invalid type parameter" });
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// Total emissions endpoint (country_emissions)
app.get("/api/total_emissions", (req, res) => {
  const { country, startYear, endYear } = req.query;
  let query = "SELECT year, total_emissions FROM country_emissions WHERE country_name = ?";
  let params = [country];
  if (startYear && endYear) {
    query += " AND year BETWEEN ? AND ?";
    params.push(Number(startYear), Number(endYear));
  }
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// GDP endpoint (gdp_emissions)
app.get("/api/gdp", (req, res) => {
  const { country, startYear, endYear } = req.query;
  let query = "SELECT year, gdp FROM gdp_emissions WHERE country_name = ?";
  let params = [country];
  if (startYear && endYear) {
    query += " AND year BETWEEN ? AND ?";
    params.push(Number(startYear), Number(endYear));
  }
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// Percentage change endpoint (emissions_change)
app.get("/api/percentage_change", (req, res) => {
  const { country, startYear, endYear } = req.query;
  let query = "SELECT year, percentage_change FROM emissions_change WHERE country_name = ?";
  let params = [country];
  if (startYear && endYear) {
    query += " AND year BETWEEN ? AND ?";
    params.push(Number(startYear), Number(endYear));
  }
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// Income per capita endpoint
app.get("/api/income", (req, res) => {
  const { country, startYear, endYear } = req.query;
  let query = "SELECT year, income FROM income_per_capita WHERE country_name = ?";
  let params = [country];
  if (startYear && endYear) {
    query += " AND year BETWEEN ? AND ?";
    params.push(Number(startYear), Number(endYear));
  }
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// Population endpoint
app.get("/api/population", (req, res) => {
  const { country, startYear, endYear } = req.query;
  let query = "SELECT year, population FROM population_emissions WHERE country_name = ?";
  let params = [country];
  if (startYear && endYear) {
    query += " AND year BETWEEN ? AND ?";
    params.push(Number(startYear), Number(endYear));
  }
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(Array.isArray(results) ? results : []);
    }
  });
});

// Admin: Add data (for any table)
app.post("/api/data", (req, res) => {
  const { table, data } = req.body;
  const validTables = [
    "gas_emissions",
    "sector_emissions",
    "country_emissions",
    "gdp_emissions",
    "emissions_change",
    "income_per_capita",
    "population_emissions"
  ];

  if (!validTables.includes(table)) {
    return res.status(400).json({ error: "Invalid table" });
  }

  const query = `INSERT INTO ${table} SET ?`;
  connection.query(query, data, (err, result) => {
    if (err) {
      // This will print the MySQL error (including your SIGNAL message) in the terminal
      console.error("🚨 Database Error:", err.message);
      res.status(400).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, id: result.insertId });
    }
  });
});

// Admin: Delete data (for any table)
app.delete("/api/data/:table/:id", (req, res) => {
  const { table, id } = req.params;
  const validTables = [
    "gas_emissions",
    "sector_emissions",
    "country_emissions",
    "gdp_emissions",
    "emissions_change",
    "income_per_capita",
    "population_emissions"
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: "Invalid table" });
  }
  
  const query = `DELETE FROM ${table} WHERE id = ?`;
  connection.query(query, [id], (err) => {
    if (err) {
      console.error("❌ Delete Error:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
