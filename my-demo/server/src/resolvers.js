const { paginateResults } = require('./utils')

module.exports = {
	Query: {
		launches: async (_, { pageSize = 20, after }, { dataSources }) => {
			// The first argument to our top-level resolvers, parent, is always blank because it refers to the root of our graph 
			const allLaunches = await dataSources.launchAPI.getAllLaunches()
			// we want these in reverse chronological order
			allLaunches.reverse()

			const launches = paginateResults({
				after,
				pageSize,
				results: allLaunches,
			})

			return {
				launches,
				cursor: launches.length ? launches[launches.length - 1].cursor : null,
				// if the cursor of the end of the paginated results is the same as the
				// last item in _all_ results, then there are no more results after this
				hasMore: launches.length
					? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
					: false,
			}
		},
		launch: (_, { id }, { dataSources }) => 
			dataSources.launchAPI.getLaunchById({launchId: id}),
		me: (_, __, { dataSources }) => 
			dataSources.userAPI.findOrCreateUser,
	},
	Mutation: {
		login: async (_, { email }, { dataSources }) => {
			const user = await dataSources.userAPI.findOrCreateUser({ email })
			if (user) return new Buffer(email).toString('base64')
		},
		bookTrips: async (_, { launchIds }, { dataSources }) => {
			/**
			 * 
			 * mutation BookTrips {
					bookTrips(launchIds: [67, 68, 69]) {
						success
						message
						launches {
							id
						}
					}
				}
				HTTP header: { "authorization": "ZGFpc3lzQGFwb2xsb2dyYXBocWwuY29t" }
			 * 
			 * 
			 * 
			 */




			const results = await dataSources.userAPI.bookTrips({ launchIds })
			const launches = await dataSources.launchAPI.getLaunchesByIds({
				launchIds,
			})
	
			return {
				success: results && results.length === launchIds.length,
				message:
					results.length === launchIds.length
						? 'trips booked successfully'
						: `the following launches couldn't be booked: ${launchIds.filter(
							id => !results.includes(id),
						)}`,
				launches,
			}
		},
		cancelTrip: async (_, { launchId }, { dataSources }) => {
			const result = await dataSources.userAPI.cancelTrip({ launchId })
	
			if (!result)
				return {
					success: false,
					message: 'failed to cancel trip',
				}
	
			const launch = await dataSources.launchAPI.getLaunchById({ launchId })
			return {
				success: true,
				message: 'trip cancelled',
				launches: [launch],
			}
		},
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