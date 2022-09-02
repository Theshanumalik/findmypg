const mongoose = require('mongoose')
const dbConnection = async (DB_URI) => {
    try {
        const conn = await mongoose.connect(DB_URI);
        if (conn) {
            console.log("CONNECTED TO DB SUCCESSFULL");
        }
    } catch (error) {
        console.log("FAILED TO CONNECT", error);
    }
};

module.exports = dbConnection