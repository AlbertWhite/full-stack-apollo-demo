const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const { createStore } = require('./utils') // used for sql
const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const store = createStore() 

// pass schema, data source, context to server
const server = new ApolloServer({ typeDefs,
	dataSources: () => ({
		launchAPI: new LaunchAPI(),
		userAPI: new UserAPI({ store })
	}),
	context: () => {
		return {}
	} }) 

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`)
})
