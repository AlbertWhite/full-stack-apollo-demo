import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';

// define mutation
export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  const client = useApolloClient();

  // return callback function to be excuted
  const [login, { loading, error }] = useMutation( 
    LOGIN_USER,
    {
      // callback function after successful mutation
      onCompleted({ login }) { 
        // why use localStorage instead of cache here? maybe it is because localStorage can save more data
        localStorage.setItem('token', login);
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  // pass mutation callback function as props to be used for submitting
  return <LoginForm login={login} />;
}
