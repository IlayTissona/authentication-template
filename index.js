const express = require("express");
// require("dotenv").config();
// const cors = require("cors");
const app = express();
// const {checkToken} = require("./auth/token_validation")
const userRouter = require("./app");
app.use(express.json());
// app.use(cors());
// app.use(checkToken());

app.use("/users", userRouter);
app.use("/", userRouter);

// Another Router
// app.use('/posts', postRouter);

// app.listen(3001, () => {
//   console.log("Server is running!!!");
// });

module.exports = app;
