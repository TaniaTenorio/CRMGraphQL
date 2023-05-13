import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from "@apollo/server/standalone"
import typeDefs from './db/schema.js'
import resolvers from './db/resolver.js'
import connectDB from './config/db.js'

// Connect DB
connectDB()

// server
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

//run server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
//   context: async() => {
//     const myContext = "Hola";

//     return {
//       myContext,
//     };
//   }
});

console.log(`🚀  Server ready at: ${url}`);