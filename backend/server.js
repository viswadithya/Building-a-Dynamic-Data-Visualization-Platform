const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); 

const app = express();
const port = 3002;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'database',
  password: 'root',
  port: 5432,
});

app.use(cors()); 
app.use(bodyParser.json());

app.get('/api/customers', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT sno, customer_name, age, phone, location, 
      to_char(created_at, 'YYYY-MM-DD') as date,
      to_char(created_at, 'HH24:MI:SS') as time
      FROM customer
      ORDER BY created_at
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
