export const getCartItems = (cart) => {
  let cartItems = cart.cartItems.map((item, index) => ({
    _id: item._id,
    prod_id: item.cartItemId._id,
    title: item.cartItemId.title,
    slug: item.cartItemId.slug,
    price: item.cartItemId.price,
    sale: item.cartItemId.sale,
    productImage: item.cartItemId.productImage[0],
    qty: item.quantity,
    size: item.size,
  }));

  const totalPrice = cartItems.reduce(
    (acc, prod) => acc + prod.price * prod.qty,
    0
  );

  const totalProducts = cartItems.reduce((acc, prod) => acc + prod.qty, 0);

  return { cartItems, totalPrice, totalProducts };
};
