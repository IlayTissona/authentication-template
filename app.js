// const express = require("express");
// // require("dotenv").config();
// // const cors = require("cors");
// const app = express();
// // const {checkToken} = require("./auth/token_validation")
// const userRouter = require("./app");
// // app.use(cors());
// // app.use(checkToken());

// app.use("/users", userRouter);
// app.use("/", userRouter);

// // Another Router
// // app.use('/posts', postRouter);

// // app.listen(3001, () => {
// //   console.log("Server is running!!!");
// // });

// module.exports = app;
const express = require("express");
const app = express();
app.use(express.json());

const {
  createUser,
  login,
  logout,
  tokenRefresh,
  tokenValidate,
  getUser,
  getUsers,
  optionsFunc,
} = require("./controller");

app.post("/users/register", createUser);
app.post("/users/login", login);
app.post("/users/logout", logout);
app.post("/users/tokenValidate", tokenValidate);
app.post("/users/token", tokenRefresh);
app.get("/api/v1/information", getUser);
app.get("/api/v1/users", getUsers);
app.options("/", optionsFunc);

app.use((req, res) => {
  res.sendStatus(404);
});

// router.post("/user", createUser);
// router.get("/myprofile", checkToken, getMyProfile);

module.exports = app;
