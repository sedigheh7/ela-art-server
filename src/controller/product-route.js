import express from 'express';
import productRepository from "../repository/product-repository.js";
import multer from 'multer';
import { send } from 'process';
import {addProductImage} from '../service/product.service.js'

const router = express.Router();

const upload = multer()
// Upload image and create a product
router.post('/', upload.single('productImage'), async (req, res) => {
    try {
      const { code, size, description, price } = req.body;
      const productImage = req.file;
      console.log(code, "code")
  
      const product = await addProductImage(code, size, description, price,  productImage);
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
router.get('/', async (reqest, response) => {
    logger.info('there is a request to get all products')
    const allProductes = await productRepository.getAllProductes();
    logger.info('getting all products are completed and there are' +allProductes.length + 'products')
    response.json(allProductes)
});

router.get('/:id', async (request, response) => {
    const productId = request.params.id;
    // find the Product by Product id in the array
    const searchedProduct = await productRepository.getProductById(productId)
    response.status(200).json(searchedProduct)
});

// router.post('/', async (request, response) => {
//     const aProduct = request.body;
//     await productRepository.createProduct(aProduct);
//     response.status(201).json();
// });

router.put('/:id', async (request, response) => {
    const productId = request.params.id;
    const aProduct = request.body;
    await changeProductInfo(productId, aProduct);
    response.status(200).json();
});

router.delete('/:id', async (request, response) => {
    const productId = request.params.id;
    await deleteProductById(productId);
    response.status(200).json();
});




export default router
