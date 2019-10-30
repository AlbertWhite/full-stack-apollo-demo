module.exports = {
	Query: {
		launches: (_, __, {dataSources}) => 
		// 	// The first argument to our top-level resolvers, parent, is always blank because it refers to the root of our graph 
		  dataSources.launchAPI.getAllLaunches(),
		launch: (_, { id }, { dataSources }) => 
			dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, { dataSources }) => 
			dataSources.launchAPI.userAPI.findOrCreateUser,
	}
}