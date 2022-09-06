import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  // console.log(req.headers.authorization)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("Si tiene el token con berer");

    try {
      // console.log(req.headers.authorization)
      token = req.headers.authorization.split(" ")[1];
      // console.log(token)

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded)

      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -token -confirmado"
      );
      // console.log(veterinario)
      return next();
    } catch (error) {
      const e = new Error("Token no válido");
      return res.status(403).json({ msg: e.message });
    }
  }
  if (!token) {
    const error = new Error("Token no válido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
