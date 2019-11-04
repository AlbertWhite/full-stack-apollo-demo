Apollo is best used as a new layer in your stack between service and apps.

“你如果要，我才给你。”

### sdl
#### comment and description
- description supports markdown in, used by describing the schema, to be used in graphql playground or vs code plugin. 
```graphql
"""
multiple line
"""

"one line"
```

- comment with # is ignored, only for users.

### schema

#### idea

- schema as a blueprint that describes all of your data's types and their relationships.
- typed.
- define what query and mutation we can make.
- **Schema First** Development and agree upon the schema first before any API development begins.
- 定义所有的数据类型，及接口(get, set)。
- all types in GraphQL are nullable by default. `!` means required.

#### query and mutation
- One request can manage several query and mutations.
- We can define the structure of returned data from query and mutation.

- create enum type for enum value.
- [cheatsheet](https://devhints.io/graphql#schema)

- mutation:

  The return type for your GraphQL mutation is completely up to you, but we recommend defining a special response type to ensure a proper response is returned back to the client. In a larger project, you might abstract this type into an interface


#### types

**type definition** should be PascalCase.

- scalar type

Int, Float, String, Boolean and ID. To be extended with array [] or object type

- object type
- query type
- mutation type
- enum type
- input type

##### input type
- For mutation input
- Input types are special object types that allow you to pass objects as arguments to queries and mutations (as opposed to passing only scalar types).

```js
input MutationInput {
  "description for field a" # possible to add description for input type
  a: String,
  b: int
}

type OutPut {
  ...
}

type Mutation {
  create(input: MutationInput): Output
}
```

- Do not use the same input type for both queries and mutations. 

#### apollo playground

  [Configurable in the code](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/), disabled for production by default. Schema and doc are generated automatically.

- [possible to create customized scalar type](https://www.apollographql.com/docs/apollo-server/schema/scalars-enums)

#### interface
- Define interface to be extended / implemented for complicated response.
- Idea of reuse between schema types.

```js
interface Interface {
  code: String!,
  success: Boolean!,
  message: String!
}

type SomeType implements Interface {
  code: String!,
  success: Boolean!,
  message: String!,
  user: User
}
```

### Hook up data source to graphql api

Data sources are classes that encapsulate fetching data.

#### RESTDataSource

Fetching data from REST API.
1. create class who extends RESTDATASource
2. put baseURL in constructor
3. create async manipulating functions and return promise (this.get/post/put/delelte). It is possible to add subUrl, querystring and payload.
4. We can add request headers, query strings and adapt for typescript with **RequestOptions**.

```js
class extends RESTDATASource {
  constructor(){
    super()
    this.baseURL = ''
  }
  
  willSendRequest(request){
    request.headers.set('Authorization', this.context.token)
    request.params.set('queryString', this.context.queryString)
  }

  async resolveURL(request){
    // resolve url dynamically
    // https://www.apollographql.com/docs/apollo-server/data/data-sources/#resolving-urls-dynamically

  }

  async getById(id){
    return this.get(`x/${id}`)
  }
  async post(something){
    return this.post('x', something)
  }
}
```

#### apollo data source
- Apollo data source is a class that encapsulates all of the data fetching logic
- It manage in memory cache. (partial query caching)
- Data reducer function format data from restful api into schema typed data.
- create data source and add them to apollo server 
- Apollo Server will put the data sources on the context for every request, so you can access them from your resolvers. It will also give your data sources access to the context.  ?????

#### Write fieldReducer
Why reducer is necessary:
Map data received from REST API to the schema we defined. (Data formatting server side according to our need. )

### Resolvers
Turning graphql operation(query, mutation, subscription) into data.

- dataSources will automatically added to the resolver's context
- Resolver function:
```js
(parent, args, context, info) => data
```
Resolver function returns data object or promise.
Resolver function can take _ and __ as parameters for a whatever value.

- Resolve types (chain resolve functions)
We can not only resolve fields Query (as entries), but also resolve type to modify the field object.  
Parent param is necessary for resolve type. 

### Mutation with authentication

### Write Query
Write query, find field to query and make the selection of sub field.

#### Write query with params
```graphql
query SomeQuery($param: ID!){
  someField(id: $param){

  }
}

Params: 
{"param": xx}

```

#### It is possible to pass param to every field
Write resolver function to resolve the param and format the response for field object. 

### Log
[high level logging](https://www.apollographql.com/docs/apollo-server/monitoring/metrics/#high-level-logging)

```js
formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
```

### Authentication
#### Authentication from authentication token from request header
1. Pass authentication token to request header. 
2. In Context, we can get request headers.
3. (By authentication token, we can get current user information from database.)
4. With user inforamtion from context, we can make modifications in data sources. 

#### Authentication in data models


### [Notion list](https://www.apollographql.com/docs/resources/graphql-glossary/)

## Apollo Client
- Query and mutation hooks, cache for local state management, pagination support.
- The names of query and mutation should be in PascalCase.

### Network Layer: Apollo Link
- [doc](https://www.apollographql.com/docs/react/networking/network-layer/)
- the configuration is like the config for **fetch**


### Cache
Remote data from graphAPI, and local data. Store local data inside Apollo cache.

**When you're using Apollo Client to work with local state, your Apollo cache becomes the single source of truth for all of your local and remote data.**

**No Redux**
We recommend managing local state in the Apollo cache instead of bringing in another state management library like Redux so the Apollo cache can be a single source of truth.

#### InMemoryCache
- [cache config](https://www.apollographql.com/docs/react/caching/cache-configuration/)
- initialization and pass to ApolloClient
```js
const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache()
});
```

#### Client Schema and Resolver for local data
Define resolvers and typeDefs on client side, and import to ApolloClient 

On client side resolver, **cache** is in the context (the thid param), like **dataSource** in the context on resolver of server side. 

#### Interact with cache data
- [doc: update local state](https://www.apollographql.com/docs/react/data/local-state/#updating-local-state)
- [another doc: update local data](https://www.apollographql.com/docs/tutorial/local-state/#update-local-data)
- **cache.writeData** write cache data
In the update option for useMutation, cache is the default param.
```js
useMutation(gql, {
  update(cache) {
    cache.writeData...
  }

})
```
- @client directive
Use @client directive next to the field. This tells Apollo Client to fetch data locally (from cache or from local resolver), instead of sending it to graphQL server. 
- **cache.readQuery** get data from your cache.
[doc](https://www.apollographql.com/docs/react/data/local-state/#writequery-and-readquery)
- **cache.writeQuery** the same as **cache.writeData**
- **client.writeData**
Always used after mutation in the callback onCompleted.

- cache.writeData and client.writeData
The same effect, different usage.

client can be got from useApolloClient.

cache is from the update option from useMutation.


### Client side hooks
- **useQuery** hooks
[doc](https://www.apollographql.com/docs/react/api/react-hooks/#usequery)

```js
const {loading, error, data} = useQuery(gql, options)
```

- RenderProps (children)
```js 
  <Query/> 
``` 

- **useMutation**
[doc](https://www.apollographql.com/docs/react/data/mutations/#options)
```js
[mutationFunction, {loading, error}] = useMutation(gql, optiions)
```

In options, we can use **OnCompleted** for the callback after mutaiton. The received data is the default input for OnCompleted function.

In the mutation function, we can pass options like **variables**.

- **useApolloClient**
get apolloClient to be used for client.writeData


### graphql Directive
- client directive
- skip and include directive
```graphql
query myAwesomeQuery($isAwesome: Boolean) {
  awesomeField @skip(if: $isAwesome) #skip directive
}

query myAwesomeQuery($isAwesome: Boolean) {
  awesomeField @include(if: $isAwesome)
}
```

### pagination
- [doc](https://www.apollographql.com/docs/react/data/pagination/)
#### Two ways
- [article](https://blog.apollographql.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7)
- numbered pages (offset based)
- cursors
we need: to cursor to start with, and the number of items.

#### fetchMore
```graphql
const {fetchMore} = useQuery(gql)

``` 

### fragment
Write fragment for share fields between queries..
```graphql
fragment XX on SomeType{

}

```

### debug
(graphql chrome extension)[https://chrome.google.com/webstore/detail/graphql-developer-tools/hflnkihcpgldmkepajmpooacmmhglpff] track queries and mutations.

