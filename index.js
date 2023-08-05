import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from "@apollo/server/standalone"
import typeDefs from './db/schema.js'
import resolvers from './db/resolver.js'
import connectDB from './config/db.js'
import jwt from 'jsonwebtoken'

// Connect DB
connectDB()

// server
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

//run server
const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async({req}) => {
    // console.log(req.headers['authorization']);
    const token = req.headers["authorization"] || '';
    // console.log("token", token);
    if(token) {
      const TOKEN = token.replace('Bearer ', "")
      // console.log('TOKEN', TOKEN);
      try {
        const user = jwt.verify(TOKEN, process.env.SECRET);
        // console.log('USER', user)
        return {
          user
        }
      } catch (error) {
        console.error('There was an error', error)
      }
    }
  }
});

console.log(`🚀  Server ready at: ${url}`);