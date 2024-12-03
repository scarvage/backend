const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
  return client.db('your-database-name'); // Replace with your database name
}

module.exports = connectToDatabase;
