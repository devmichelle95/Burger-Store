import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductsController from "./app/controllers/ProductsController.js";
import CategoriesController from "./app/controllers/CategoriesController.js";
import OrderController from "./app/controllers/OrderController.js";
import multerconfig from "./config/multerconfig.js";
import multer from "multer";
import authMiddleware from "./app/middlewares/auth.js"

const routes = new Router();
const uploads = multer(multerconfig)

routes.get('/', (req, res)=>{
    return res.json({message:'Hello to my API'})
})

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post ("/products", uploads.single ('file'), ProductsController.store)
routes.get ("/products", ProductsController.index)
routes.put("/products/:id", uploads.single ('file'), ProductsController.update)

routes.post ("/categories", uploads.single('file'), CategoriesController.store)
routes.get ("/categories", CategoriesController.index)
routes.put ("/categories/:id", uploads.single ('file'), CategoriesController.update)

routes.post ("/order", OrderController.store)
routes.get ("/order", OrderController.index)
routes.put ("/order/:id", OrderController.update)

export default routes;
