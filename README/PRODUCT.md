## Summary api category

## USE

1. get all products

- method : GET
- url: localhost:5000/products/?search=abc
  - nếu không có search thì lất tất cả product, có phân trang

2. get products by slug

- method: GET
- url: localhost:5000/products/Giay-Vans/?rating=5&minPrice=495000&maxPrice=550000&page=1&limit=20
  - rating: filter theo rating,
  - minPrice, maxPrice: filter theo price
  - page, limit => phân trang

2. get initial data

- method: GET
- url: localhost:5000/products/initial-data
  - lấy dữ liệu ban đầu

3. get product detail

- method: GET
- url: localhost:5000/products/detail/Giay-The-Thao-Adi.das-Superstar-Trang-mui-so-F1
  - lấy theo slug của product
