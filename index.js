const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
global.__basedir = __dirname;
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: `Welcome to language learning API.` });
});

require("./app/routes/user.routes")(app);
require("./app/routes/certificate.routes")(app);
require("./app/routes/enrollment.routes")(app);
require("./app/routes/progress.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/passwordReset.routes")(app);
require("./app/routes/userContent.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
