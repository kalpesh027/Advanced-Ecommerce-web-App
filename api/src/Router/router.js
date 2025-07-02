import express from "express";
import adminRouter from "../routes/admin.route.js";
import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import categoryRouter from "../routes/category.routes.js";
import ratingRouter from "../routes/rating.routes.js";
import reviewRouter from "../routes/review.routes.js";
import productRouter from "../routes/product.js";
import addressRoute from "../routes/address.route.js";

import couponsRoute from "../routes/coupons.route.js";
import OrderRouter from "../routes/order.route.js";
import deliveryRoute from "../routes/delivery.routes.js";
import { importProducts } from "../controller/importexport.js";
import paymentRoute from "../routes/payment.route.js";
import { testingRegisterUser } from "../controller/testing.controller.js";
import Test from "../routes/test.js";
import sectioTitleRouter from '../routes/advertisementSectionTitle.routes.js'
import Timelocationroute from "../routes/Time_location_routes.js";
import wishlistRouter from '../routes/wishlist.routes.js'
import { timeroutes } from "../routes/time_routes.js";
import cartRouter from "../routes/cart.routes.js";
import { sendmail_routes } from "../routes/sendmail_routes.js";
import { profitrevenueroutes } from "../routes/Profit_revenue_routes.js";
const allRouter = express.Router();

allRouter.use("/admin", adminRouter);
allRouter.use("/auth", authRouter);
allRouter.use("/user", userRouter);
allRouter.use("/category", categoryRouter);
allRouter.use("/rating", ratingRouter);
allRouter.use("/review", reviewRouter);
allRouter.use("/product", productRouter);
allRouter.use("/address", addressRoute);
allRouter.use("/coupons", couponsRoute);
allRouter.use("/order", OrderRouter);
allRouter.use('/cart',cartRouter)
allRouter.use("/delivery", deliveryRoute);
allRouter.use("/payment", paymentRoute);
allRouter.use('/import',importProducts);
allRouter.use('/test',Test);
allRouter.use('/advertisementSectionTitle',sectioTitleRouter);
allRouter.use('/timelocation',Timelocationroute)
allRouter.use("/wishlist",wishlistRouter);
allRouter.use("/time",timeroutes)
allRouter.use("/cart", cartRouter)

allRouter.use("/sendmail", sendmail_routes)
allRouter.use("/profitrevenue", profitrevenueroutes)

export default allRouter;
