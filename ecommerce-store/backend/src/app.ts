import express from "express";
import cors from "cors";

import cart from "./routes/cart.routes";
import checkout from "./routes/checkout.routes";
import admin from "./routes/admin.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/cart", cart);
app.use("/checkout", checkout);
app.use("/admin", admin);

export default app;
