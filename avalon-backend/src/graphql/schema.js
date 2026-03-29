const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
  GraphQLNonNull,
} = require('graphql');

const User = require('../models/User');

// ---------------------------------------------------------------------------
// GraphQL Schema – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Provides a read-only GraphQL API alongside the existing REST endpoints.
// Scalable — add AuctionType, BidType, mutations etc. as the app grows.
// ---------------------------------------------------------------------------

// ========================  ENUM TYPES  ========================

const RoleEnumType = new GraphQLEnumType({
  name: 'Role',
  values: {
    BUYER: { value: 'buyer' },
    SELLER: { value: 'seller' },
  },
});

// ========================  OBJECT TYPES  ======================

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A registered user on the Avalon platform',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(RoleEnumType) },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    // Note: password_hash is intentionally excluded
  }),
});

// ========================  ROOT QUERY  ========================

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query for the Avalon API',
  fields: () => ({
    // --- Fetch all users ---
    users: {
      type: new GraphQLList(UserType),
      description: 'Returns a list of all registered users',
      resolve: async () => {
        return await User.findAll({
          attributes: { exclude: ['password_hash'] },
          order: [['id', 'ASC']],
        });
      },
    },

    // --- Fetch a single user by ID ---
    user: {
      type: UserType,
      description: 'Returns a single user by ID',
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_parent, args) => {
        return await User.findByPk(args.id, {
          attributes: { exclude: ['password_hash'] },
        });
      },
    },
  }),
});

// ========================  SCHEMA  ============================

const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: RootMutationType,  // uncomment when mutations are added
});

module.exports = schema;
