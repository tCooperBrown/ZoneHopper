const { Router } = require("express");
const { Request, Response } = require("express");
const controller = require("../controller/controller");

const userRouter = Router();

userRouter.post("/update-line", controller.updateUserLine);

module.exports = userRouter;
