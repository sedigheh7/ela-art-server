import express from "express";
import {
  updateShippingAddress,
} from "../repository/shippingAddress-repository.js";

const router = express.Router();

// Update shipping address
router.put(
            "/customersShippingAddress/:customerId/:addressId", updateShippingAddress
);

export default router;
