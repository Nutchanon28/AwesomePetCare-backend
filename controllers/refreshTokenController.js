const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    // console.log(cookies);
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);
    console.log(foundUser);
    console.log("refreshed");

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403);
            // const roles = Object.values(foundUser.roles); // why do I get null without filter?
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            res.json({ roles, accessToken });
        }
    );
};

module.exports = { handleRefreshToken };
