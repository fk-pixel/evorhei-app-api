const mongoose = require("mongoose");

const connectDB = async (req, res, next) => {
    try {
        const con = await mongoose.connect(
            process.env.MONGO_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });
        console.log(`MongoDB Connected ${con.connection.host}`);
    } catch (error) {
        console.log(`DB Conection failed: ${error}`);
        next(error);
    };
};

module.exports = connectDB;