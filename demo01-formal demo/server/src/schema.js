const { gql } = require('apollo-server')
const typeDefs = gql`
  # schema goes here
  type Query {
    launches: [Launch]
    launch(id: ID!): Launch
    me: User
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Mutation {
    # if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse! # special return type for mutation, turned into an interface in the big project
    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String # login token
  }

  enum PatchSize { # define enum type
    SMALL
    LARGE
  }
`

module.exports = typeDefs
