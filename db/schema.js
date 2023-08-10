// Schema
const typeDefs = `#graphql
    type User {
        id: ID
        name: String
        last_name: String
        email: String
        created_at: String
        rol: String
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
        created_at: String
    }

    type OrderProduct {
        id: ID
        amount: Int
        name: String
        price: Float
    }

    type Order {
        id: ID
        order: [OrderProduct]
        total: Float
        client: Client
        seller: ID
        date: String
        status: OrderStatus
    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopSeller {
        total: Float
        seller: [User]
    }

    input UserInput {
        name: String!
        last_name: String!
        email: String!
        password: String!
        rol: String!
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
        name: String
        price: Float
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
        getUser : User

        getProducts : [Product]
        getOneProduct(id: ID!) : Product

        getClients(limit: Int) : [Client]
        getClientsSeller(limit: Int, offset: Int) : [Client]
        getClient(id: ID!): Client
        getTotalClients : String

        getOrders: [Order]
        getOrderSeller: [Order]
        getOrder(id: ID!) : Order
        getOrdersByStatus(status: String!) : [Order]

        bestClients: [TopClient]
        bestSellers: [TopSeller]
        searchProduct(text: String!): [Product]
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
