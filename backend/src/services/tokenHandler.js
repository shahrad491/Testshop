import jwt from "jsonwebtoken";

const tokenGen = async function (res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: "strict",
    maxAge: 3600 * 1000 * 24,
  });
};

export { tokenGen };
