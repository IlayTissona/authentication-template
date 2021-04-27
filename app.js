const router = require("express").Router();
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

router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/tokenValidate", tokenValidate);
router.post("/token", tokenRefresh);
router.get("/api/v1/information", getUser);
router.get("/api/v1/users", getUsers);
router.options("/", optionsFunc);

router.use((req, res) => {
  if (req.method === "OPTIONS") res.sendStatus(404);
  res.sendStatus(404);
});

// router.post("/user", createUser);
// router.get("/myprofile", checkToken, getMyProfile);

module.exports = router;
