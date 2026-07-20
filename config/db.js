const mongoose = require('mongoose');

const connectDB = async () => {
  try {
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://narjis-fatima:Adobe110!@cluster0.tfwtbck.mongodb.net/gamingHub?retryWrites=true&w=majority';
  const conn = await mongoose.connect(mongoUri);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
