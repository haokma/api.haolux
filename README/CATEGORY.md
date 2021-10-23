## Summary api category

- branch: route/category

- body
  - name
  - parentId: có hoặc ko, không có = main category, có = sub category
- params
  - id của category

## USE

1. get all categories

- url: localhost:5000/category
- api trả về 2 kiểu
  - list của các category
- response
  - status: "success",
    category: {
    {
    "\_id": "600bcf1ab4df7b2184619798",
    "name": "category 1",
    "slug": "category-1"
    },
    {
    "\_id": "600bcf39b4df7b2184619799",
    "name": "category 1 sub 1 update",
    "slug": "category-1-sub-1-update",
    "parentId": "600bcf1ab4df7b2184619798"
    }
  - group các category dựa vào trường parentId
- response
  - status: "success",
    categories: {
    "\_id": "600bcf1ab4df7b2184619798",
    "name": "category 1",
    "slug": "category-1",
    "children": [
    {
    "\_id": "600bcf39b4df7b2184619799",
    "name": "category 1 sub 1 update",
    "parentId": "600bcf1ab4df7b2184619798",
    "slug": "category-1-sub-1-update",
    "children": []
    }
    ]
    },

2. create category

- url: localhost:5000/category/create
- body bao gồm : name và parentId (có hoặc không)
- response
  - status: "success",
    category: newCategory,

3. update category

- url: localhost:5000/category/:id
- body bao gồm : name và parentId (có hoặc không)
- response
  - status: "success",
    message: "Update category successful",

4. delete category

- url: localhost:5000/category/:id
- body bao gồm : name và parentId (có hoặc không)
- response
  - status: "success",
    message: "Delete category successful",
