const { buildSchema } = require('graphql');

const schema =  buildSchema(`
    type Workout{
        _id: ID!
        title: String!
        date: String!
        description: String!
        sets: String!
        creator: User!
    }
    type User{
        _id: ID!
        email: String!
        password: String
        workoutTypes: [String!]
    }
    type AuthData{
        email: String!
        userId: ID!
        token: String!
        tokenExpiration: Int!
        workoutTypes: [String!]
    }
    input WorkoutInput {
        title: String!
        date: String!
        description: String!
        sets: String!
    }
    input UserInput {
        email: String!
        password: String!
    }
    type RootQuery {
        workouts: [Workout!]!
        login(email: String!, password: String!): AuthData!
        users: [User]
    }
    type RootMutation {
        createWorkout(workoutInput: WorkoutInput): Workout
        createUser(userInput: UserInput): User
        deleteWorkout(workoutId: ID!): Workout!
        deleteWorkouts: [Workout]
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
module.exports = schema;
