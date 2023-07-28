const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const corsOptions = {origin: '*'}
app.use(cors(corsOptions))

app.use(cookieParser())
const dotenv = require('dotenv')
app.use(express.json());
dotenv.config()
const { productRouter } = require("./routers/productRouters/productRouter");
const { connectProductDB } = require("./database/productDB");
const { errorHandler } = require("./middlewares/errorHandler");
const { userRouter } = require("./routers/userRouters/userRouter");
const { cartRouter } = require("./routers/cartRouter/cartRouter");
connectProductDB();



app.use("/",productRouter);
app.use('/accounts', userRouter )
app.use('/accounts/cart', cartRouter)





app.use(errorHandler)
app.listen(process.env.PORT, () => {
  console.log("http://localhost:5000");
});
