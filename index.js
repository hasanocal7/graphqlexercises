import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

const filePath = 'db.json';

let db;

try {
  const data = readFileSync(filePath, 'utf8');
  db = JSON.parse(data);
} catch (err) {
  console.error(err);
}

const typeDefs = `#graphql
type User {
  id: ID!
  username: String!
  email: String!
}

type Event {
  id: ID!
  title: String!
  desc: String!
  date: String!
  from: String!
  to: String!
  location_id: Int
  user_id: ID!
  user: User!
  participants: [Participant!]!
  location: Location!
}

type Location {
  id: ID!
  name: String!
  desc: String!
  lat: Float!
  lng: Float!
}

type Participant {
  id: ID!
  user_id: ID!
  event_id: ID!
}

type Query {
  users: [User!]!
  user(id: ID!): User!

  events: [Event!]!
  event(id: ID!): Event

  locations: [Location!]!
  location(id: ID!): Location!

  participants: [Participant!]!
  participant(id: ID!): Participant
}
`;

const resolvers = {
    Query: {
      users: () => db.users,
      events: () => db.events,
      locations: () => db.locations,
      participants: () => db.participants,
    },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`)
