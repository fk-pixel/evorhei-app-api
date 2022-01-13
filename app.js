const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
    res.json("Hey i am ok!")
});

const PORT = process.env.PORT;

//DB connection
connectDB();

// Import routes
const authRoutes = require('./routes/user'); 
const productsRoutes = require("./routes/products");
app.use('/user', authRoutes);
app.use('/products', productsRoutes);

// Error handling
app.use((error,req,res,next) => {
    console.log("--ERROR--", error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
});

app.listen(PORT, () => {
    console.log(`Server is runnign on http://localhost:${PORT}`)
});
