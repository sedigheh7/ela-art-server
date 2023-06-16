import ShippingAddress from "../model/shippingAddress-model.js";

async function getAllShippingAddresses(){
    return await Product.findAll(); 
}

// async function getshippingAddressByCustomerId(pProductId){
//     return await Product.findByPk(pProductId); 
// }

async function createShippingAddress({ addressLine1, addressLine2, city, state, postalCode, country}){

    await Product.create({addressLine1, addressLine2, city, state, postalCode, country}); 
}

async function changeShippingAddressInfo(pShippingAddressId, {addressLine1, addressLine2, city, state, postalCode, country}){
    await Product.update({addressLine1, addressLine2, city, state, postalCode, country}, {
            where: {
                id: pShippingAddressId
            }
       });       
}

async function deleteShippingAddressById(pShippingAddressId){
    await Product.destroy({
        where: {
          id: pShippingAddressId
        }
       }); 
}


export default {

    createShippingAddress,
    changeShippingAddressInfo,
    deleteShippingAddressById,
    getAllShippingAddresses,
}