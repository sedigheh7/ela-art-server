

import { uploadFile } from './object.storage.service.js';
import productRepository from '../repository/product-repository.js';

const addProductImag = async (code, size, description, price, image, productImage) => {
  try {
    // Upload image to the cloud storage
    const uploadedImage = await uploadFile(productImage.buffer, productImage.originalname, 'your-bucket-name');
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

export { addProductImag };
