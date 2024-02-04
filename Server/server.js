const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

const db = mysql.createConnection({
  host: '127.0.0.1',   //'10.1.178.135','192.168.0.52'
  user: 'user',
  password: '',
  database: 'mydb',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } 
  else {
    console.log('Connected to MySQL');
  }
});

// Middleware-ek
app.use(bodyParser.json());

// Felhasználó létrehozása
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('User created successfully');
      res.status(201).send('User created');
    }
  });
});

// Összes felhasználó lekérése
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(results);
    }
  });
});

//Szerver indítása
app.listen(port, '0.0.0.0',() => {
  console.log(`Server is running on port ${port}`);
});
