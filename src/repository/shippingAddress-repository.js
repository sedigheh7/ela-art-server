import ShippingAddress from '../model/shippingAddress-model.js';
import Customer from '../model/customer-model.js';


// Update shipping address
export const updateShippingAddress = async (req, res) => {
  try {
    const { customerId, addressId } = req.params;
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const shippingAddress = await ShippingAddress.findOne({
      where: { id: addressId, customerId },
    });

    if (!shippingAddress) {
      return res.status(404).json({ error: 'Shipping address not found' });
    }

    await shippingAddress.update(req.body);

    return res.status(200).json(shippingAddress);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
