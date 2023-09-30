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
  events: [Event]
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
  users: [User]
  user(id: Int): User

  events: [Event]
  event(id: Int): Event

  locations: [Location]
  location(id: Int): Location

  participants: [Participant]
  participant(id: Int): Participant
}
`;

const resolvers = {
    Query: {
      
      users: () => db.users,
      user: (parent, args) => {
        const data = db.users.find((user) => user.id === args.id);
        return data;
      },
      
      events: () => db.events,
      event: (parent, args) => {
        const data = db.events.find(event => event.id === args.id)
        return data
      }, 
      
      locations: () => db.locations,
      location: (parent, args) => {
        const data = db.locations.find(location => location.id === args.id)
        return data
      }, 
      
      participants: () => db.participants,
      participant: (parent, args) => {
        const data = db.participants.find(participant => participant.id === args.id)
        return data
      }, 
    },
    
    User:{
      events:(parent)=> db.events.filter(event => event.user_id == parent.id)
    },

    Event: {
      user: (parent) => {
        return db.users.find(user => user.id === parent.user_id)
      },

      location: (parent) => {
        return db.locations.find(location => location.id === parent.location_id)
      },
      
      participants: (parent) => {
        return db.participants.filter(participant => participant.user_id === parent.user_id)
      },
    }

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`)
