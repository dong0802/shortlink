const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to hardcoded connection
    const mongoURI = process.env.MONGODB_URI ||
      'mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Please check:');
    console.error('   1. MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)');
    console.error('   2. Database username and password');
    console.error('   3. Network connection');
    process.exit(1);
  }
};

module.exports = connectDB;
