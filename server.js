require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const User = require("./model/User");
const PORT = process.env.PORT || 3500;

const stripeWebhookController = require("./controllers/stripeWebhookController");
const { getFileStream } = require("./s3");

connectDB();

app.use(credentials);

app.use(cors(corsOptions));

app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    stripeWebhookController.webhook
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.get("/images/:key", (req, res) => {
    // console.log(req.params);
    const key = req.params.key; // TODO: fix 403 s3 error when image doesn't exist

    if (!key) return res.status(400).json({ message: "Image key missing" });
    const readStream = getFileStream(key);

    readStream.pipe(res);
});

// app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/profile", require("./routes/profile"));
app.use("/pet", require("./routes/pet"));
app.use("/ticket", require("./routes/ticket"));

app.use("/stripe", require("./routes/payment"));

app.use("/users", require("./routes/user"));

app.all("*", async (req, res) => {
    res.sendStatus(404);
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
