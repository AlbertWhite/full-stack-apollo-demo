Apollo is best used as a new layer in your stack between service and apps.

### schema

#### idea

- schema as a blueprint that describes all of your data's types and their relationships.
- typed.
- define what query and mutation we can make.
- **Schema First** Development and agree upon the schema first before any API development begins.

#### types

- scalar type
- object type
- query type
- mutation type
- enum type
- input type

Input types are special object types that allow you to pass objects as arguments to queries and mutations (as opposed to passing only scalar types).

#### practice

- all types in GraphQL are nullable by default. `!` means required.
- start with query type, then create object type.
- default scalar types: Int, Float, String, Boolean and ID. More complex type: array [] or object type.
- create enum type for enum value.
- [cheatsheet](https://devhints.io/graphql#schema)

- mutation:

  The return type for your GraphQL mutation is completely up to you, but we recommend defining a special response type to ensure a proper response is returned back to the client. In a larger project, you might abstract this type into an interface

- apollo playground

  [Configurable in the code](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/), disabled for production by default. Schema and doc are generated automatically.

- [possible to create customized scalar type](https://www.apollographql.com/docs/apollo-server/schema/scalars-enums)
