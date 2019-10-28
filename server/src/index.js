const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')

const server = new ApolloServer({ typeDefs }) // pass schema to server

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
