import User from '../models/User.js'
import Product from '../models/Product.js';
import Client from '../models/Client.js';
import Order from '../models/Order.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (user, secret, expiresIn) => {
  console.log(user);
  const { id, email, name, last_name } = user;

  return jwt.sign({ id, email, name, last_name }, secret, { expiresIn });
};

// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, {}, ctx) => {
      console.log('CTX', ctx);
      return ctx.user
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});

        return products;
      } catch (error) {
        console.error(error);
      }
    },
    getOneProduct: async (_, { id }, ctx) => {
      // Check if product exists
      const product = await Product.findById(id);

      if (!product) {
        throw new Error("Product does not exist");
      }

      return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.error(error);
      }
    },
    getClientsSeller: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({ seller: ctx.user.id.toString() });
        return clients;
      } catch (error) {}
    },
    getClient: async (_, { id }, ctx) => {
      // Check if client exists
      const client = await Client.findById(id);

      if (!client) {
        throw new Error("Client does not exist");
      }

      // Only the linked seller can see the client
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to acces this information");
      }

      return client;
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.error(error);
      }
    },
    getOrderSeller: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ seller: ctx.user.id }).populate('client');

        console.log('orders', orders);
        return orders;
      } catch (error) {
        console.error(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      // Check if order exists
      const validOrder = await Order.findById(id);
      if (!validOrder) {
        throw new Error("Order id does not exist");
      }

      // Only assigned seller can fetch data
      if (validOrder.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to access this information");
      }

      // Return data
      return validOrder;
    },
    getOrdersByStatus: async (_, { status }, ctx) => {
      // Bring order only from authenticated seller and with status selected
      const orders = await Order.find({ seller: ctx.user.id, status })

      return orders

    },
    bestClients: async () => {
      const clients = await Order.aggregate([
        { $match: { status: "COMPLETED" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: '_id',
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $sort : { total: -1 }
        }
      ]);

      return clients
    },
    bestSellers: async () => {
      const sellers = await Order.aggregate([
        { $match: { status: "COMPLETED"} },
        {
          $group: {
            _id: "$seller",
            total: { $sum: "$total"}
          }
        },
        { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        }},
        {
          $limit: 3
        },
        {
          $sort: { total: -1 }
        }
      ])
      return sellers
    },
    searchProduct: async (_, { text }) => {
      const products = await Product.find({ $text: { $search: text }})
      // Nice to have: add pagination

      return products
    }
  },
  Mutation: {
    newUser: async (_, { input }, ctx) => {
      const { email, password } = input;

      // Check if user already exists
      const userRegistered = await User.findOne({ email });
      if (userRegistered) {
        throw new Error("User already exists");
      }
      // Hash password
      const salt = await bcryptjs.genSalt(10);

      input.password = await bcryptjs.hash(password, salt);
      try {
        // Save user in DB
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.error(error);
      }
    },
    authUser: async (_, { input }, ctx) => {
      const { email, password } = input;

      // Check if user exists
      const userRegistered = await User.findOne({ email });
      if (!userRegistered) {
        throw new Error("User does not exist");
      }

      // Check if password is valid
      const validPassword = await bcryptjs.compare(
        password,
        userRegistered.password
      );
      if (!validPassword) {
        throw new Error("Incorrect Password");
      }

      // Create token
      return {
        token: createToken(userRegistered, process.env.SECRET, "24h"),
      };
    },
    newProduct: async (_, { input }, ctx) => {
      try {
        const product = new Product(input);

        // Save in DB
        const res = await product.save();

        return res;
      } catch (error) {
        console.error(error);
      }
    },
    updateProduct: async (_, { id, input }, ctx) => {
      // Check if product exists
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Product does not exist");
      }

      // save product in DB
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return product;
    },
    deleteProduct: async (_, { id }, ctx) => {
      // Check if product exists
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Product does not exist");
      }

      // Delete
      await Product.findOneAndDelete({ _id: id });

      return "Product deleted seuccessfully";
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      console.log(ctx);
      // Check if client is registered
      const client = await Client.findOne({ email });
      if (client) {
        throw new Error("Client already exists");
      }

      const newClient = new Client(input);
      // Assingn seller
      newClient.seller = ctx.user.id;
      // Save in DB
      try {
        const result = await newClient.save();
        return result;
      } catch (error) {
        console.error(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      // Check if client exists
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Client does not exist");
      }

      // Check if seller has acces to client info
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You do not have access to edit this information");
      }

      // Save data
      client = await Client.findOneAndUpdate({ _id: id }, input, { new: true });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      // CHeck if client exists
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Client does not exist");
      }

      // Check if seller has acces to client info
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You do not have access to edit this information");
      }

      // Delete client
      await Client.findOneAndDelete({ _id: id });
      return "Client successfully deleted";
    },
    newOrder: async (_, { input }, ctx) => {
      // Check if client exists
      const { client, order } = input;

      let validClient = await Client.findById(client);

      if (!validClient) {
        throw new Error("Client does not exist");
      }

      // Check if seller is linked to client
      if (validClient.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot create orders for this client");
      }

      // Check available stock
      for await (const element of order) {
        const { id } = element;

        const product = await Product.findById(id);

        if (element.amount > product.stock) {
          throw new Error(
            `The amount requested of ${product.name} exceeds the stock available`
          );
        } else {
          // Update stock
          product.stock = product.stock - element.amount;

          await product.save();
        }
      }

      // Create new order
      const newOrder = new Order(input);

      // Assing seller to order
      newOrder.seller = ctx.user.id;

      // Save order in DB
      const result = await newOrder.save();
      return result;
    },
    updateOrder: async (_, { id, input }, ctx) => {
      const { client } = input;

      // Check if order exixts
      const validOrder = await Order.findById(id);

      if (!validOrder) {
        throw new Error("Order id does not exist");
      }

      // Check if client exists
      const validClient = await Client.findById(client);
      if (!validClient) {
        throw new Error("Client id does not exist");
      }

      // Check if client and order is linked to seller
      if (validClient.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to access this information");
      }

      if (validOrder.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to access this information");
      }

      // Check stock
      if (input.order) {
        for await (const element of input.order) {
          const { id } = element;

          const product = await Product.findById(id);

          if (element.amount > product.stock) {
            throw new Error(
              `The amount requested of ${product.name} exceeds the stock available`
            );
          } else {
            // Update stock
            product.stock = product.stock - element.amount;

            await product.save();
          }
        }
      }

      // Save changes
      const result = await Order.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return result;
    },
    deleteOrder: async (_, { id }, ctx) => {
      // Check if order exists
      const validOrder = await Order.findById(id);
      if (!validOrder) {
        throw new Error("Order id does not exists");
      }

      // Check if order is linked to seller
      if (validOrder.seller.toString() !== ctx.user.id) {
        throw new Error("You are not allowed to access this information");
      }

      // Delete order
      await Order.findOneAndDelete({ _id: id });
      return "Order deleted successfully";
    },
  },
};

export default resolvers
