import Customer from "../model/customer-model.js";
import ShippingAddress from "../model/shippingAddress-model.js";
import CartItem from "../model/cart-model.js";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "sedigheh.asgarifard@hicoders.ch",
    pass: process.env.GMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  ignoreTLS: true,
});


const getAllCustomer = async () => {
  const customer = await Customer.findAll();
  return customer;
};

const createCustomer = async (pCustomer) => {
  try {
     // Check if user with provided email already exists
     const existingUser = await Customer.findOne({ where: { email: pCustomer.email } });
     if (existingUser) {
       throw new Error('User with this email already exists');
     }
     // Create new user if email does not exist
    const newCustomer = await Customer.create(pCustomer);

    const emailOptions = {
      from: "sedigheh.asgarifard@hicoders.ch",
      to: pCustomer.email,
      subject: "Hello",
      html: "Welcome to Ela Art Gallery",
    };
    transporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        console.log("hello");
        console.error(err);
      } else console.log(info);
    });
    return newCustomer;
  }catch (error) {
    throw new Error('error while getting users');
  }
 
};

// Get profile by mail
const getCustomerByEmail = async (pEmail) => {
  try {
    const user = await Customer.findOne({
      where: {
        email: pEmail
      }
    })
    return user;
  } catch (error) {
    throw new Error('error while getting users');
  }

}

//Get users profile
const getUserProfile = async (pCustomerId) =>{
  try {
    const customer = await Customer.findByPk(pCustomerId, {
      include: [ 'ShippingAddress',],
    });
    return customer
  } catch (error) {
    throw new Error('Failed to retrieve user profile' );
  }
}
//edit button profile
async function changeCustomerInfo(
  pCustomerId,
  { firstName, lastName, email }
) {
  await Customer.update(
    { firstName, lastName, email },
    {
      where: {
        id: pCustomerId,
      },
    }
  );
}

const deleteCustomer = async (id) => {
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw new Error(`Customer with id ${id} does not exist`);
    }
    await Customer.destroy();
    return Customer;
  } catch (error) {
    throw error;
  }
};
//contact us page
const contactUsSendEmail = async (pUserData) => {
  try {
    const emailOptions = {
      from: pUserData.email,
      to: "sedigheh.asgarifard@hicoders.ch",
      subject: "new content from submition",
      html: `
            <p>Name: ${pUserData.name}</p>
            <p>Email: ${pUserData.email}</p>
            <p>Phone: ${pUserData.phone}</p>
            <p>Message: ${pUserData.message}</p>
          `,
    };
    transporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        console.log("hello");
        console.error(err);
      } else console.log(info);
    });
    // send automatic response to user
    const autoResponseOptions = {
      from: "sedigheh.asgarifard@hicoders.ch",
      to: pUserData.email,
      subject: "Thank you for your email",
      html: "<p>Thank you for contacting us. We will respond as soon as possible.</p>",
    };

    await transporter.sendMail(autoResponseOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

//creat customers shipping Address
const createShippingAddress = async (customerId, shippingAddressData) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const shippingAddress = await ShippingAddress.create(shippingAddressData);

    await customer.setShippingAddress(shippingAddress);

    return shippingAddress;
  } catch (error) {
    throw new Error("Error while creating a shipping address");
  }
};

//customer creat cart
const createCartItem = async (customerId, cartItemData) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartItem = await CartItem.create({
      productId: cartItemData.productId,
      quantity: cartItemData.quantity,
      amount: cartItemData.amount,
    });
    await customer.addCartItem(cartItem)
    return cartItem;
  } catch (error) {
    throw new Error('Error while creating a cart item');
  }
};

const getCartItems = async (customerId) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return await customer.getCartItems();
  } catch (error) {
    throw new Error('Error while creating a cart item');
  }
};

//update cart item
const updateCartItem = async (customerId, cartItemId, cartItemData) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        customerId: customer.id,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.update({
      productId: cartItemData.productId,
      quantity: cartItemData.quantity,
      amount: cartItemData.amount,
    });

    return cartItem;
  } catch (error) {
    throw new Error('Error while updating the cart item');
  }
};
//delete cart item
const deleteCartItem = async (customerId, cartItemId) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        customerId: customer.id,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();

    return;
  } catch (error) {
    throw new Error('Error while deleting the cart item');
  }
};
// clear all cart items 
const clearCart = async (customerId) => {
  try {
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    await CartItem.destroy({
      where: {
        customerId: customer.id,
      },
    });

    return;
  } catch (error) {
    throw new Error('Error while clearing the cart');
  }
};





export default {
  getAllCustomer,
  getCustomerByEmail,
  createCustomer,
  changeCustomerInfo,
  deleteCustomer,
  contactUsSendEmail,
  getUserProfile,
  createShippingAddress,
  createCartItem,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  clearCart
};
