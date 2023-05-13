import User from '../models/User.js'
import bcryptjs from 'bcryptjs'



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
    }
  }
}

export default resolvers
