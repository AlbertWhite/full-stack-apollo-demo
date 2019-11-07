import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import Pages from './pages';
import Login from './pages/login';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { resolvers, typeDefs } from './resolvers';
import injectStyles from './styles';

// create locale cache management
const cache = new InMemoryCache();

// create network layer
const link = new HttpLink({
  uri: 'http://localhost:4000/',
  headers: {
    authorization: localStorage.getItem('token'),
    'client-name': 'Space Explorer [web]',
    'client-version': '1.0.0',
  }
});

// create client with cache, link, resolvers (for cache) and typeDefs (for cache)
const client = new ApolloClient({
  cache,
  link,
  resolvers,
  typeDefs,
});

// write data to cache (local state)
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  },
});


// use @client directive to make query from local cache, 
// instead of from sending the query to graphql server
const IS_LOGGED_IN = gql`
  query IsUserLogged {
    isLoggedIn @client
  }
`

console.warn('alb',{IS_LOGGED_IN});

// run query on the cache to determine the page to show
const Component = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

// define global style
injectStyles();

// pass client to provider
ReactDOM.render(
  <ApolloProvider client={client}>
    <Component/>
  </ApolloProvider>, document.getElementById('root')
);