// require('dotenv').config();

const { ApolloServer } = require('apollo-server')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { createStore } = require('./utils')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')


// creates a sequelize connection once. NOT for every request
const store = createStore()

// set up any dataSources our resolvers need
const dataSources = () => ({
	launchAPI: new LaunchAPI(),
	userAPI: new UserAPI({ store }),
})

// the function that sets up the global context for each resolver, using the req
const context = {}

// Set up Apollo Server
const server = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources,
	context,
	// formatError: error => {
	// 	console.log('error', error)
	// 	return error
	// },
	// formatResponse: response => {
	// 	console.log('response', response)
	// 	return response
	// },
})

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
server
	.listen({ port: 4000 })
	.then(({ url }) => console.log(`🚀 app running at ${url}`))

// export all the important pieces for integration/e2e tests to use
module.exports = {
	dataSources,
	context,
	typeDefs,
	resolvers,
	ApolloServer,
	LaunchAPI,
	UserAPI,
	store,
	server,
}
