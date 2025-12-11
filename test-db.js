// Test MongoDB connection
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        const uri = 'mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

        console.log('Testing MongoDB connection...');
        console.log('URI:', uri.replace(/dong2004@/, '****@')); // Hide password in log

        const conn = await mongoose.connect(uri);

        console.log('✅ SUCCESS! Connected to MongoDB');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);

        await mongoose.connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILED! Error:', error.message);
        console.error('\nPossible solutions:');
        console.error('1. Check MongoDB Atlas Network Access:');
        console.error('   - Go to MongoDB Atlas → Network Access');
        console.error('   - Add IP Address: 0.0.0.0/0 (allow from anywhere)');
        console.error('2. Verify username: dong2004_db_user');
        console.error('3. Verify password: dong2004');
        console.error('4. Check your internet connection');
        process.exit(1);
    }
};

testConnection();
