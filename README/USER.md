## Summary api user

- src: middleware/auth

- branch: route/user/update-auth

- tạo một số middleware cho việc signin và user role

- tạo router refresh-token với end point: localhost:2000/user/refresh-token

  - reftoken : có thể gửi trong body hoặc params

- chú ý có một số chỉnh sửa trong file controller user.js cũ.

## USE

1. change function auth => requireSignin
2. create:

- userProfile: for get profile của user đã signin đặt sau requireSignin
- userRequire hoặc adminRequire : kiểm soát quyền của user, đặt sau userProfile

- ex: router.post("/create", signinRequire, userProfile, adminRequire, addCategory);

3. refresh-token => trả về token và refresh token mới
