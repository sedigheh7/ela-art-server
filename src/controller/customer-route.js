import express from "express";
import customerRepository from "../repository/customer-repository.js";
import productRepository from "../repository/product-repository.js";

const router = express.Router();
//get all customer
router.get("/", async (req, res, next) => {
  try {
    let customer = await customerRepository.getAllCustomer();
    return res.status(200).json(customer);
  } catch (error) {
    return next({ status: 404, message: error });
  }
});

// creat a new Customer
router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const newCustomer = await customerRepository.createCustomer(body);
    return res.send(newCustomer);
  } catch (error) {
    return next({ status: 500, message: error });
  }
});

// Get profile by mail
router.get("/profile/email/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await customerRepository.getCustomerByEmail(userEmail);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: "Error fetching users" });
  }
});

//Get users profile
router.get("/profile/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const user = await customerRepository.getUserProfile(customerId);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: "Error fetching users" });
  }
});

// update a customer
router.put("/:id", async (request, response) => {
  const customerId = request.params.id;
  const aCustomer = request.body;
  await customerRepository.changeCustomerInfo(customerId, aCustomer);
  response.status(200).json();
});

// delete a Customer
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedCustomer = await customerRepository.deleteCustomer(id);
    res.json(deletedCustomer);
  } catch (error) {
    next(error);
  }
});
// contact us send email
router.post("/send-email", async (req, res, next) => {
  try {
    const user = req.body;
    const userEmail = await customerRepository.contactUsSendEmail(user);
    return res.send(userEmail);
  } catch (error) {
    return next({ status: 500, message: error });
  }
});

// Create shipping address
router.post("/customersShippingAddress/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const shippingAddress = req.body;
    const result = await customerRepository.createShippingAddress(
      customerId,
      shippingAddress
    );
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update customer's shipping address
router.put("/customersShippingAddress/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const shippingAddress = req.body;
    const result = await customerRepository.updateShippingAddress(
      customerId,
      shippingAddress
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


//add cart item
router.post("/customer-cart/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { productId, quantity, amount } = req.body;

    const cardItem = await customerRepository.hasCardItemWithProduct(customerId, productId);

    if(cardItem){
      const newQuantity = quantity + cardItem.quantity;
      await customerRepository.deleteProductFromCard(customerId, productId);
      const product = await productRepository.getProductById(productId);
      const cartItem = await customerRepository.createCartItem(customerId, {
        productId,
        quantity: newQuantity,
        amount: (product.price * (newQuantity)),
      });
      return res.status(201).json(cartItem);
    }else{
      const cartItem = await customerRepository.createCartItem(customerId, {
        productId,
        quantity,
        amount,
      });
      return res.status(201).json(cartItem);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customer-cart/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const cartItems = await customerRepository.getCartItems(customerId);
    const totalItems = cartItems.reduce((previous, next)=> previous + next.amount, 0)

    return res.status(200).json({
      items: cartItems,
      total: totalItems
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update customer cart items
router.put("/customer-cart/:customerId/:productId", async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { productId, quantity, amount } = req.body;

    // delete productId from customer card
    await customerRepository.deleteProductFromCard(customerId, productId);
    const product = await productRepository.getProductById(productId);
    const cartItem = await customerRepository.createCartItem(customerId, {
      productId,
      quantity,
      amount: (product.price * quantity),
    });

    return res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// deletecustomer cart item
router.delete(
  "/customer-cart/:customerId/:cartItemId",
  async (req, res, next) => {
    try {
      const { customerId, cartItemId } = req.params;

      await customerRepository.deleteCartItem(customerId, cartItemId);
      return res
        .status(200)
        .json({ message: "Cart item deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/customer-cart/:customerId", async (req, res, next) => {
  try {
    const { customerId } = req.params;

    await customerRepository.clearCart(customerId);
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
