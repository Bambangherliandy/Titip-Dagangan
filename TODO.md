Titip Dagangan API Documentation
Base URL:
http://localhost:3000

# 1. POST /user/register – User Registration

# Description:

Register user baru (role: user / staff)

Request Body:

````json
{
"email": "string",
"password": "string",
"name": "string"
}```

Responses:

201 Created

{
"id": 1,
"email": "user@example.com",
"name": "Bambang"
}

400 Bad Request

{ "message": "Email is required" }
{ "message": "Password is required" }
{ "message": "Email already used" } 2. POST /user/login – User Login

Request Body:

{
"email": "string",
"password": "string"
}

Responses:

200 OK

{
"access_token": "jwt_token",
"email": "user@example.com",
"role": "user"
}

401 Unauthorized

{ "message": "Invalid E-mail / Password" } 3. GET /pub/product – Public List Products

Description:
Get all products for public view (search, filter, sort, pagination)

Query Parameters (optional):

search=string // search by product name
category=string // filter by category
sort=ASC|DESC // sort by createdAt
page=number // pagination page
limit=number // pagination limit

Response 200 OK

[
{
"id": 1,
"name": "Laptop",
"description": "Gaming Laptop",
"price": 20000000,
"stock": 5,
"imageUrl": "",
"categoryId": 2,
"authorId": 1,
"createdAt": "2026-02-04T07:54:11.141Z",
"updatedAt": "2026-02-04T07:54:11.141Z"
}
]

404 Not Found

{ "message": "Not found" } 4. GET /pub/product/:id – Public Product Detail

Params:

{ "id": "integer" }

Response 200 OK

{
"id": 1,
"name": "Laptop",
"description": "Gaming Laptop",
"price": 20000000,
"stock": 5,
"imageUrl": "",
"categoryId": 2,
"authorId": 1,
"createdAt": "...",
"updatedAt": "..."
}

404 Not Found

{ "message": "Not found" } 5. GET /product – Authenticated User Product List

Headers:

{ "access_token": "string" }

Response 200 OK

[
{
"id": 1,
"name": "Laptop",
"description": "Gaming",
"price": 20000000,
"stock": 5,
"imageUrl": "",
"categoryId": 2,
"authorId": 1,
"Author": { "email": "admin@example.com" },
"Category": { "name": "Gadget" }
}
]

401 Unauthorized

{ "message": "Please Log in First!" } 6. POST /product – Create Product

Headers:

{ "access_token": "string" }

Request Body:

{
"name": "string",
"description": "string",
"price": 10000,
"stock": 5,
"imageUrl": "string",
"categoryId": 1
}

Response 201 Created

{
"id": 1,
"name": "Laptop",
"description": "Gaming",
"price": 20000000,
"stock": 5,
"imageUrl": "",
"categoryId": 2
}

400 Bad Request

{ "message": "Name required" }
{ "message": "Price required" }
{ "message": "Description required" }
{ "message": "Category required" }

403 Forbidden

{ "message": "Forbidden access" } 7. GET /product/:id – Authenticated Product Detail

Headers:

{ "access_token": "string" }

Params:

{ "id": "integer" }

Response 200 OK

{
"id": 1,
"name": "Laptop",
"description": "Gaming",
"price": 20000000,
"stock": 5,
"imageUrl": "",
"authorId": 1,
"Category": { "name": "Gadget" },
"Author": { "email": "admin@example.com" }
}

404 Not Found

{ "message": "Not found" }

403 Forbidden

{ "message": "Forbidden access" } 8. PUT /product/:id – Update Product

Headers:

{ "access_token": "string" }

Body:

{
"name": "string",
"description": "string",
"price": 10000,
"stock": 5,
"imageUrl": "string",
"categoryId": 1
}

Responses:

200 OK → updated product object

400 Bad Request → validation error

403 Forbidden → forbidden access (staff non-owner)

404 Not Found → product not exist

9. DELETE /product/:id – Delete Product

Headers:

{ "access_token": "string" }

Params:

{ "id": "integer" }

Responses:

200 OK

{ "message": "Product has been deleted" }

403 Forbidden

{ "message": "Forbidden access" }

404 Not Found

{ "message": "Not found" } 10. PATCH /product/:id/upload – Update Product Image

Headers:

{ "access_token": "string" }

Body:

{ "imageUrl": "string" }

Response 200 OK

{
"message": "Success",
"data": {
"id": 1,
"name": "Laptop",
"description": "Gaming",
"price": 20000000,
"stock": 5,
"imageUrl": "url"
}
}

403 Forbidden → staff tidak punya akses

404 Not Found → product tidak ada

11. GET /category – List Categories

Headers:

{ "access_token": "string" }

Response 200 OK

{
"categories": [
{
"id": 1,
"name": "Elektronik",
"Products": [ ... ]
},
{
"id": 2,
"name": "Gadget",
"Products": [ ... ]
}
]
} 12. POST /category – Create Category

Headers:

{ "access_token": "string" }

Body:

{ "name": "string" }

Responses:

200 OK → success + category object

400 Bad Request → name required

403 Forbidden → non-admin access

13. PUT /category/:id – Update Category

Headers:

{ "access_token": "string" }

Body:

{ "name": "string" }

Responses:

200 OK → success + updated category

400 Bad Request → name required

403 Forbidden → non-admin access

404 Not Found → category not exist

14. DELETE /category/:id – Delete Category

Headers:

{ "access_token": "string" }

Params:

{ "id": "integer" }

Responses:

200 OK

{ "message": "Category has been deleted" }

404 Not Found

{ "message": "Not found" }
Global Error Responses

401 Unauthorized

{ "message": "Please Log in First!" }

500 Internal Server Error

{ "message": "Internal server error" }
````
