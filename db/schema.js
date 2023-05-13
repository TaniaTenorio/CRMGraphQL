// Schema
const typeDefs = `#graphql
    type User {
        id: ID
        name: String
        last_name: String
        email: String
        created_at: String
    }

    input UserInput {
        name: String!
        last_name: String!
        email: String!
        password: String!
    }

    type Query {
        getCourse: String
    }

    type Mutation {
        newUser(input: UserInput!) : User
    }
`;

export default typeDefs
