## Summary api category

- branch: route/cart

## USE

1. create cart

- method: POST
- data:
  {
  "cartItemId":"601015e86e989f46b051b0f0",
  "quantity":1,
  "size":39
  }

- url: localhost:5000/cart/create
- response:
  {
  "status": "success",
  "message": "Ban da mua hang thanh cong",
  "totalProducts": 4
  }

2. update cart

- mehtod: POST
- url: localhost:5000/cart/update/Giay-XSPORT-ADD-Alphabounce-Beyond-REP?size=38&quantity=6
- response:

3. get cart by user

- method: GET
- url: localhost:5000/cart
- response:

4. delete cart

- method: DELETE
- url: localhost:5000/cart/6019dd8d4c09e525d80834c4
- response:
