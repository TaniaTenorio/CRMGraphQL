import User from '../models/User.js'
import Product from '../models/Product.js';
import Client from '../models/Client.js';
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
    getUser: async (_, { token }, ctx) => {
      const userId = await jwt.verify(token, process.env.SECRET);

      return userId;
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
        const clients = await Client.find({ seller: ctx.user.id.toString()})
        return clients
      } catch (error) {
        
      }
    },
    getClient: async (_, {id}, ctx) => {
      // Check if client exists
      const client = await Client.findById(id)

      if(!client) {
        throw new Error('Client does not exist')
      }

      // Only the linked seller can see the client
      if(client.seller.toString() !== ctx.user.id) {
        throw new Error ('You are not allowed to acces this information')
      }

      return client
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
    updateClient: async (_, {id, input}, ctx) => {
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
      client = await Client.findOneAndUpdate({_id: id}, input, {new: true})
      return client
    },
    deleteClient: async (_, {id}, ctx) => {
      // CHeck if client exists
      let client = await Client.findById(id)

      if(!client) {
        throw new Error('Client does not exist')
      }

      // Check if seller has acces to client info
      if(client.seller.toString() !== ctx.user.id){
        throw new Error('You do not have access to edit this information')
      }

      // Delete client 
      await Client.findOneAndDelete({_id: id})
      return 'Client successfully deleted'
    }
  },
};

export default resolvers
