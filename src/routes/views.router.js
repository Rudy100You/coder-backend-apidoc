import { Router } from "express";
import { currentUserCanHaveCarts, validateSession } from "../utils/middlewares/session.validations.js";
import ProductController from "../controllers/product.controller.js";
import ProductRepository from "../dao/repository/product.repository.js";
import ProductService from "../services/product.service.js";
import CartController from "../controllers/cart.controller.js";
import CartService from "../services/cart.service.js";
import CartRepository from "../dao/repository/cart.repository.js";

const viewsRouter = Router();
const productService = new ProductService(new ProductRepository())
const productController = new ProductController(productService)
const cartController = new CartController(new CartService(productService, new CartRepository()), productService)

const validRoutes = ['product','products','cart','carts','profile']
const validateValidRouteOrNotExists = (req,res,next)=>{
  if(!validRoutes.includes(req.params.route))
    res.status(404).redirect('/error')
  else
    next();
}

viewsRouter.use('/:route',validateValidRouteOrNotExists,validateSession);

viewsRouter.get("/products", (req, res) => {
  res.redirect("/products/1");
});

viewsRouter.get("/products/:pgid?", async (req, res) => {
  const { pgid } = req.params || 1;
  let { category, sort } = req.query;
  let data;
  try {
    data = await productController.getAllProducts(
      10,
      pgid,
      { category: category },
      sort
    );
    if (isNaN(pgid) || pgid > data.totalPages)
      data = { invalidPageError: true };
  } catch (err) {
    console.error(err);
  }
  res.render("products", data);
});

viewsRouter.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  let products;
  try {
    products = await productController.getProduct(pid);
  } catch (err) {
    console.error(err);
  }
  res.render("product", products);
});

viewsRouter.get("/carts/:cid" ,currentUserCanHaveCarts,async (req, res) => {
  const { cid } = req.params;
  let cart;
  try {
    cart = await cartController.getCart(cid);
  } catch (err) {
    console.error(err);
  }
  res.render("cart", cart);
});

viewsRouter.get("/", (req, res) => {
  res.send();
});

viewsRouter.get("/profile", (req, res) => {
  res.render("profile", { user: req.session.passport.user });
});


export default viewsRouter;
