const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ username }).exec();
    console.log("foundUser = ", foundUser);
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        console.log(roles);

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: username,
                    roles: roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );
        const refreshToken = jwt.sign(
            { username: username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // console.log(result);
        // console.log(roles);

        // comment "secure: true" out when using Postman
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        const navbar = roles.includes(5150)
            ? "5150"
            : roles.includes(2001)
            ? "2001"
            : null;

        if (navbar) {
            res.cookie("navbar", navbar, {
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        res.json({ roles, accessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };
