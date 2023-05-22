const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const PORT = 3500;

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.all("*", (req, res) => {
  res.status(200);
  res.json({ text: "Hello World" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
