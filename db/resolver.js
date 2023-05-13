import User from '../models/User.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (user, secret, expiresIn) => {
  console.log(user);
  const { id, email, name, last_name } = user;

  return jwt.sign({ id }, secret, { expiresIn });
};

// Resolvers
const resolvers = {
  Query: {
    getCourse: () => 'Curso'
  },
  Mutation: {
    newUser: async (_, { input }, ctx) => {
      const { email, password } = input

      // Check if user already exists
      const userRegistered = await User.findOne({ email })
      if (userRegistered) {
        throw new Error('User already exists')
      }
      // Hash password
      const salt = await bcryptjs.genSalt(10)
      
      input.password = await bcryptjs.hash(password, salt)
      try {
        // Save user in DB
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.error(error)
      }
    },
    authUser: async (_, {input}, ctx) => {
      const { email, password } = input

      // Check if user exists
      const userRegistered = await User.findOne({email})
      if (!userRegistered) {
        throw new Error("User does not exist");
      }

      // Check if password is valid
      const validPassword = await bcryptjs.compare(password, userRegistered.password)
      if (!validPassword) {
        throw new Error('Incorrect Password')
      }

      // Create token
      return {
        token: createToken(userRegistered, process.env.SECRET, '24h')
      }
    }
  }
}

export default resolvers
