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

    type Client {
        id: ID
        name: String
        last_name: String
        company: String
        email: String
        phone: String
        seller: ID
    }

    type OrderProduct {
        id: ID
        amount: Int
    }

    type Order {
        id: ID
        order: [OrderProduct]
        total: Float
        client: ID
        seller: ID
        date: String
        status: OrderStatus
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

    input ClientInput {
        name: String!
        last_name: String!
        company: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        amount: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        client: ID
        status: OrderStatus
    }

    enum OrderStatus {
        PENDING
        COMPLETED
        CANCELLED
    }

    type Query {
        getUser(token: String!) : User

        getProducts : [Product]
        getOneProduct(id: ID!) : Product

        getClients : [Client]
        getClientsSeller : [Client]
        getClient(id: ID!): Client

        getOrders: [Order]
        getOrderSeller: [Order]
        getOrder(id: ID!) : Order
    }

    type Mutation {
        newUser(input: UserInput!) : User
        authUser(input: AuthInput!) : Token

        newProduct(input: ProductInput) : Product
        updateProduct(id: ID!, input: ProductInput) : Product
        deleteProduct(id: ID!) : String

        newClient(input: ClientInput) : Client
        updateClient(id: ID!, input: ClientInput) : Client
        deleteClient(id: ID!) : String

        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput): Order
        deleteOrder(id: ID!): String
    }
`;

export default typeDefs
