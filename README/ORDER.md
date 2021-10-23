## Summary api category

- branch: route/order

## USE

1. create order

- method: POST
- data:
  {
  "cardId":"601cafcb670b57112c84ca4a",// id của cart
  "cart": [ // các product từ cart chuyển thành format này nhé
  {
  "productId": "601015e86e989f46b051b0f0",
  "payablePrice": 430000,
  "purchaseQty": 1
  },
  {
  "productId": "601015e86e989f46b051b0f0",
  "payablePrice": 430000,
  "purchaseQty": 1
  }
  ],
  "name": "kent bui 123",
  "phone": "012345678",
  "city": "ha noi",
  "town": "cau giay",
  "address": "1234567890",
  "fee": 30000, // hiện tại đang để cái này cố định, khi nào làm phần địa chỉ thì cho vào, và tính toán khi up địa chỉ thành công, hiện tại đang bỏ qua
  "totalAmount": 860000 // cai nay tinh toan o local luon nhe
  }

- url: localhost:5000/order/create
- response:

2. update order:// sau này phat triển thêm, khi các đơn hàng cập nhật trạng thái

3. get all order by user => for admin

- method: GET
- url: localhost:5000/order
- response:

4. delete order

- method: DELETE
- xóa 1 đơn hàng trong list đặt hàng của khách hàng
- url: localhost:5000/order/601cb37c80060a18fcc645d6
- response:

5. get an order

- method: GET
- xem 1 đơn hàng
- url: localhost:5000/order/601bc330f2279420e02f35e7
- response
