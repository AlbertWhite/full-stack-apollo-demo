const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const { createStore } = require('./utils') // used for sql
const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const store = createStore() 

const server = new ApolloServer({ typeDefs,
	dataSources: () => ({
		launchAPI: new LaunchAPI(),
		userAPI: new UserAPI({ store })
	}) }) // pass schema to server

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`)
})
