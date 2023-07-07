# RESTful API for Products and Orders

This project is a simple REST API with CRUD of orders and products in a MongoDB database. An authorization system with JWT has been implemented to ensure security and you can only edit if you are a registered user.

## Features

### Products

- **Create a Product**: Create a new product with details such as name, price, and image.
- **Read Products**: Retrieve a list of all products or get details of a specific product.
- **Update a Product**: Update the details of an existing product.
- **Delete a Product**: Remove a product from the database.

### Orders

- **Create an Order**: Place an order for one or more products, including the quantity and customer details.
- **Read Orders**: Retrieve a list of all orders or get details of a specific order.
- **Update an Order**: Update the details of an existing order, such as the status or shipping information.
- **Delete an Order**: Remove an order from the database.

### Authentication and Authorization

- **User Registration**: Allow users to register with their email and password.
- **User Login**: Authenticate users and issue a JSON Web Token (JWT) for authorization.
- **Access Control**: Secure routes using JWT authentication and authorization middleware.
- **Token Expiration**: Set an expiration time for JWT tokens to ensure security.
- **Password Hashing**: Store user passwords securely by hashing them with bcrypt.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Multer (for image uploads)

## Setup

1. Make sure you have Node.js installed on your system.
2. Clone this repository: `git clone https://github.com/ArthurKellermann/expressProductOrders.git`
3. Navigate to the project directory: `cd expressProductOrders/`
4. Install dependencies: `npm install`
5. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables to the `.env` file:
     - `MONGO_URI` - the connection URI for your MongoDB database
     - `JWT_SECRET` - the secret key for JWT token generation
6. Start the server: `npm start`
7. The API will be accessible at `http://localhost:3000` (or the port you specified).

## License

This project is licensed under the [MIT License](LICENSE).

