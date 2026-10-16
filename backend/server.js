import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


//app config
const app = express()
const port = 4000

// middleware
app.use(express.json());//request from front to back pass here in json
app.use((req, res, next) => {
    if (!req.body) {
        req.body = {};
    }
    next();
});
app.use(cors()) //access backend from any fronend

//db connection
connectDB();

// api endpoint
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use["/api/order", orderRouter]

app.get("/", (req, res) => {
    res.send("Api working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
})

