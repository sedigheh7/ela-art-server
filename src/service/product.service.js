

import { uploadFile } from './object.storage.service.js';
import productRepository from '../repository/product-repository.js';

const addProductImage = async (code, size, description, price, productImage) => {
  try {
    // Upload image to the cloud storage
    const uploadedImage = await uploadFile(productImage.buffer, productImage.originalname, process.env.AWS_BUCKET_NAME);
    const imageUrl = uploadedImage.Location; // Get the URL of the uploaded image

    // Create the product in the database with the image URL
    const product = await productRepository.createProduct({
      code,
      size,
      description,
      price,
      image: imageUrl,
    });

    return product;
  } catch (error) {
    throw error;
  }
};

export { addProductImage };
