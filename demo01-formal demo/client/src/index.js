
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
});

const client = new ApolloClient({
  cache,
  link
});

// client
//   .query({
//     query: gql`
//       query GetLaunch {
//         launch(id: 56) {
//           id
//           mission {
//             name
//           }
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));


// previous variable declarations

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>, document.getElementById('root')
);