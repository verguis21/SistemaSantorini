import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes";
import productRoutes from "./modules/products/product.routes";
import categoryRoutes from "./modules/categories/category.routes";
import tableRoutes from "./modules/tables/table.routes";
import accountRoutes from "./modules/accounts/account.routes";
import orderRoutes from "./modules/orders/order.routes";
import kitchenRoutes from "./modules/kitchen/kitchen.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";

const app = express();

app.use(cors());

app.use(express.json());

//routes
app.use("/api", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tables",tableRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/kitchen",kitchenRoutes);
app.use("/api/checkout",checkoutRoutes);


app.get("/", (req,res)=>{

res.json({
message:"Santorini API funcionando"
});

});
export default app;