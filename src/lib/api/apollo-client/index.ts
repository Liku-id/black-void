/* eslint-disable import/no-anonymous-default-export */
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  // Use provided URL or fallback
  uri: process.env.NEXT_PUBLIC_RESTURL_API_SERVER || 'https://api-staging.eku.id/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-client-version": "1.0.0",
      origin: process.env.NEXT_PUBLIC_RESTURL_CORS || typeof window !== 'undefined' ? window.location.origin : '',
      "accept-language": "id",
    },
  };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});
