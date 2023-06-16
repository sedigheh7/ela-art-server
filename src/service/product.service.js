import { v4 as uuidv4 } from 'uuid';

import { uploadFile, downloadFile } from './object.storage.service.js';
import productRepository from '../repository/product-repository.js';

const addProductImage = async (code, size, description, price, productImage) => {
  try {
    // Upload image to the cloud storage
    const originalName = productImage.originalname.replace(/\s/g, '_');
    const fileName = `ela_${uuidv4()}_${originalName}`;
    const uploadedImage = await uploadFile(productImage.buffer, fileName, process.env.AWS_BUCKET_NAME);
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

const getProductImage = async (pProductId) => {
  const product = await productRepository.getProductById(pProductId);

  if (!product) {
    return null;
  }

  const fileKey = product.image.split('/').pop();

  return await downloadFile(fileKey, process.env.AWS_BUCKET_NAME);
}

export { addProductImage, getProductImage };
