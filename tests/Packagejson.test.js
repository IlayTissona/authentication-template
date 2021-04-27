const server = require("../index");

const originalPackageJSON = {
  name: "server",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    test:
      "C:/Users/ilay2/OneDrive/Documents/GitHub/authentication-template/node_modules/.bin/jest",
    dev: "nodemon index.js",
    start: "",
  },
  keywords: [],
  author: "",
  license: "ISC",
  dependencies: {
    bcrypt: "^5.0.0",
    express: "^4.17.1",
    jsonwebtoken: "^8.5.1",
    morgan: "^1.10.0",
    nodemon: "^2.0.4",
  },
  devDependencies: {
    jest: "^24.9.0",
    supertest: "^4.0.2",
  },
};

describe("PackageJSON tests", () => {
  afterAll(async () => {
    await server.close();
  });

  test("Verify Package.JSON file has not changed", async (done) => {
    const testPackageJSON = require("../package.json");
    for (let i in originalPackageJSON) {
      expect(obJize(originalPackageJSON[i])).toBe(obJize(testPackageJSON[i]));
      for (let prop in originalPackageJSON[i]) {
        expect(testPackageJSON[i].hasOwnProperty(prop)).toBe(true);
      }
    }
    done();
  });
});
function obJize(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}
