// continue https://www.apollographql.com/docs/react/data/pagination/#using-fetchmore
// continue https://www.apollographql.com/docs/tutorial/queries/#build-a-paginated-list

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components'

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launches() {
  // limit defined from the backend
  const { data, loading, error, fetchMore  } = useQuery(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  return (
    <>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile
            key={launch.id}
            launch={launch}
          />
        ))}
      {data.launches &&
        data.launches.hasMore && (
          <Button
            onClick={() =>
              // use the fetchMore function provided by useQuery hook
              fetchMore({
                variables: {
                  after: data.launches.cursor, // auto managed by useQuery hook (use cursor returned from query as the after variable)
                },

                // https://www.apollographql.com/docs/react/data/pagination/#cursor-based
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    launches: {
                      ...fetchMoreResult.launches,
                      launches: [
                        ...prev.launches.launches,
                        ...fetchMoreResult.launches.launches,
                      ],
                    },
                  };
                },
              })
            }
          >
            Load More
          </Button>
      )}
    </>
  );
}