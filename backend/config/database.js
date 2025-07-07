const mongoose = require('mongoose');
require('dotenv').config(); 

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connection successful");
    } catch (error) {
        console.error("Error in database connection:", error);
        process.exit(1); 
    }
};

module.exports = dbConnect;
