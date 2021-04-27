const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");

const USERS = [
  {
    name: "admin",
    email: "admin@email.com",
    password: "$2b$10$6apzfHkpDSdRtSRlT9NUz.s.rdjYlWizSdLytKu4k63w3M9zE7dxG",
    isAdmin: true,
  },
];
const INFORMATION = [
  {
    email: "admin@email.com",
    info: "admins info",
  },
];
const REFRESHTOKENS = [];

const OPSTIONSARR = [
  {
    method: "post",
    path: "/users/register",
    description: "Register, Required: email, name, password",
    example: {
      body: { email: "user@email.com", name: "user", password: "password" },
    },
  },
  {
    method: "post",
    path: "/users/login",
    description: "Login, Required: valid email and password",
    example: { body: { email: "user@email.com", password: "password" } },
  },
  {
    method: "post",
    path: "/users/token",
    description: "Renew access token, Required: valid refresh token",
    example: { headers: { token: "*Refresh Token*" } },
  },
  {
    method: "post",
    path: "/users/tokenValidate",
    description: "Access Token Validation, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "get",
    path: "/api/v1/information",
    description: "Access user's information, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "post",
    path: "/users/logout",
    description: "Logout, Required: access token",
    example: { body: { token: "*Refresh Token*" } },
  },
  {
    method: "get",
    path: "api/v1/users",
    description: "Get users DB, Required: Valid access token of admin user",
    example: { headers: { authorization: "Bearer *Access Token*" } },
  },
];

const getUsers = (req, res) => {
  let token = req.get("Authorization");
  if (!token) return res.status(401).send("Access Token Required");
  token = token.slice(7);

  verify(token, "supersecret", (err, decoded) => {
    if (err || !decoded.result.isAdmin) {
      return res.status(403).send("Invalid Access Token");
    } else {
      res.json(USERS);
    }
  });
};

const optionsFunc = (req, res) => {
  let token = req.get("Authorization");
  res.set("Allow", "OPTIONS, GET, POST");
  if (!token) return res.json(OPSTIONSARR.filter((v, i) => i < 2));
  token = token.slice(7);

  verify(token, "supersecret", (err, decoded) => {
    if (err) {
      return res.json(OPSTIONSARR.filter((v, i) => i < 3));
    } else if (decoded.result.isAdmin) {
      return res.json(OPSTIONSARR);
    } else {
      return res.json(OPSTIONSARR.filter((v, i) => i < 6));
    }
  });
};

const createUser = (req, res) => {
  const body = req.body;
  body.password = hashSync(body.password, genSaltSync(10));

  const isExisting = USERS.some(
    (user) => user.name === body.name || user.email === body.email
  );
  if (isExisting) return res.status(409).send("user already exists");

  USERS.push(body);
  INFORMATION.push({
    email: body.email,
    info: `${body.name} info`,
  });
  res.status(201).send("Register Success");
};

const login = (req, res) => {
  try {
    const body = req.body;

    const existing = { ...USERS.find((user) => user.email === body.email) };
    if (!existing) return res.status(404).send("cannot find user");

    const isPasswordCorrect = compareSync(body.password, existing.password);
    if (!isPasswordCorrect)
      return res.status(403).send("User or Password incorrect");

    existing.password = null;

    const accessToken = sign({ result: existing }, "supersecret", {
      expiresIn: "10s",
    });

    let refreshToken = sign({ result: existing }, "notsosupersecret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      accessToken,
      refreshToken,
      email: existing.email,
      name: existing.name,
      isAdmin: existing.isAdmin ? true : false,
    });
  } catch (error) {
    res.json({ error });
  }
};

const logout = (req, res) => {
  let { token } = req.body;
  if (!token) return res.status(400).send("Refresh Token Required");
  verify(token, "notsosupersecret", (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid Refresh Token");
    } else {
      req.decoded = decoded;

      res.status(200).send("User Logged Out Successfully");
      // next();
    }
  });
};

const tokenValidate = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) return res.status(401).send("Access Token Required");
  // Remove Bearer from string
  token = token.slice(7);
  verify(token, "supersecret", (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid Access Token");
    } else {
      req.decoded = decoded;
      res.json({ valid: true });
      // next();
    }
  });
};

const tokenRefresh = (req, res, next) => {
  let { token } = req.body;
  if (!token) return res.status(401).send("Refresh Token Required");
  verify(token, "notsosupersecret", (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid Refresh Token");
    } else {
      req.decoded = decoded;
      const accessToken = sign({ result: decoded.result }, "supersecret", {
        expiresIn: "10s",
      });
      res.json({ accessToken });
      // next();
    }
  });
};

const getUser = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) return res.status(401).send("Access Token Required");
  // Remove Bearer from string
  token = token.slice(7);

  verify(token, "supersecret", (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid Access Token");
    } else {
      // req.decoded = decoded;
      const { email } = decoded.result;
      const userInfo = INFORMATION.filter((u) => u.email === email);

      res.json(userInfo);
      // next();
    }
  });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  tokenRefresh,
  login,
  logout,
  tokenValidate,
  optionsFunc,
};
