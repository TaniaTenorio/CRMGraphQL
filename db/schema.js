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

    type Query {
        getUser(token: String!) : User
    }

    type Mutation {
        newUser(input: UserInput!) : User
        authUser(input: AuthInput) : Token
    }
`;

export default typeDefs
