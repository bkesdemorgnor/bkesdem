//import dotenv from 'dotenv';
const dotenv = require('dotenv');

dotenv.config();
//export default {
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/onsapdb',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080',
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb',
};
