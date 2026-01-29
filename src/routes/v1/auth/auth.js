import jwt from "jsonwebtoken";
import helper from "../helpers/helper.js";

const refreshToken = (req, res) => {
  try{
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);

    const accessToken = helper.createAccessToken({
      userId: payload.userId,
    });

    res.json({ accessToken });
  });
}
catch(e){
  console.log(e)
}
}

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    path: "/auth/refresh",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};
export default {
  refreshToken,
  logout
};