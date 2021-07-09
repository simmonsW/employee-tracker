const express = require('express');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express;

// express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});