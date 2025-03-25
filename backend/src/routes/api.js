import express from "express";

import orderRouter from "./order.router.js";
import productRouter from "./product.router.js";
import uploadRouter from "./upload.router.js";
import userRouter from "./user.router.js";

const apiRouter = express.Router();

apiRouter.use("/orders", orderRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
