Apollo is best used as a new layer in your stack between service and apps.

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
#### apollo data source
- Apollo data source is a class that encapsulates all of the data fetching logic
- It manage in memory cache. (partial query caching)

#### RESTDataSource 