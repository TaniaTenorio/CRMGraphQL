// Schema
const typeDefs = `#graphql
    type User {
        id: ID
        name: String
        last_name: String
        email: String
        created_at: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        stock: Int
        price: Float
        created_at: String
    }

    input UserInput {
        name: String!
        last_name: String!
        email: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    type Query {
        getUser(token: String!) : User

        getProducts : [Product]
        getOneProduct(id: ID!) : Product
    }

    type Mutation {
        newUser(input: UserInput!) : User
        authUser(input: AuthInput!) : Token

        newProduct(input: ProductInput) : Product
        updateProduct(id: ID!, input: ProductInput) : Product
    }
`;

export default typeDefs
