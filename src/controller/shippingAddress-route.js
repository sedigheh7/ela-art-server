import express from 'express';
import shippingAddressRepository from '../repository/shippingAddress-repository.js';
const router = express.Router();

router.post('/', async (request, response) => {
    const aProduct = request.body;
    await shippingAddressRepository.createShippingAddress(aShippingAddress);
    response.status(201).json();
});
//get all customer
router.get("/", async (req, res, next) => {
    try {
        let shippingAddress = await shippingAddressRepository.getAllShippingAddresses();
        return res.status(200).json(shippingAddress);
    }catch (error) {
        return next({status: 404, message:error});
    }
});

router.put('/:id', async (request, response) => {
    const shippingAddressId = request.params.id;
    const aShippingAddress = request.body;
    await shippingAddressRepository.changeShippingAddressInfo(shippingAddressId, aShippingAddress);
    response.status(200).json();
});

router.delete('/:id', async (request, response) => {
    const productId = request.params.id;
    await deleteProductById(productId);
    response.status(200).json();
});