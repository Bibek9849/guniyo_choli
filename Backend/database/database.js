
// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGODB_URL; // Use the local MongoDB URL
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to local MongoDB');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL; // Ensure your MongoDB URL is in your .env file
        await mongoose.connect(uri);
        console.log('Connected to local MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
