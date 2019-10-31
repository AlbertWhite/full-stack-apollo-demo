module.exports = {
	Query: {
		launches: (_, __, {dataSources}) => 
		// 	// The first argument to our top-level resolvers, parent, is always blank because it refers to the root of our graph 
		 dataSources.launchAPI.getAllLaunches(),
		launch: (_, { id }, { dataSources }) => 
			dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, { dataSources }) => 
			dataSources.launchAPI.userAPI.findOrCreateUser,
	},
	Mission: {
		// write resolver for other types except Query and Mutation
		// resolve the missionPatch field with parent object "mission"
		missionPatch: (mission, {size} = {size: 'LARGE'}) => { // make sure the default size is 'large' in case user doesn't specify
			return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge
		}
		/**
		 * Query Example
		 * 
		 * query GetLaunches($id: ID!) {
				launch(id: $id) {
						id
						site
						mission{
							name
							missionPatch(size: LARGE)
						}
						isBooked
				} 
			}
		 * 
		 */
	},
	Launch: {
		isBooked: async (launch, _, { dataSources }) =>
			dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
	},
	User: {
		trips: async (_, __, { dataSources }) => {
			// get ids of launches by user
			const launchIds = await dataSources.userAPI.getLaunchIdsByUser()
	
			if (!launchIds.length) return []
	
			// look up those launches by their ids
			return (
				dataSources.launchAPI.getLaunchesByIds({
					launchIds,
				}) || []
			)
		},
	}
}