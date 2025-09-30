import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import data from "./db.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return data.games;
    },
    game(_, args) {
      return data.games.find((g) => g.id === args.id);
    },
    reviews() {
      return data.reviews;
    },
    review(_, args) {
      return data.reviews.find((r) => r.id === args.id);
    },
    authors() {
      return data.authors;
    },
    author(_, args) {
      return data.authors.find((a) => a.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return data.reviews.filter((reviews) => reviews.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return data.reviews.filter((reviews) => reviews.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return data.authors.find((author) => author.id === parent.author_id);
    },
    game(parent) {
      return data.games.find((game) => game.id === parent.game_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      data.games = data.games.filter((game) => game.id !== args.id);
      return data.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      data.games.push(game);
      return game;
    },
    updateGame(_, args) {
      data.games = data.games.map((game) => {
        if (game.id === args.id) {
          return { ...game, ...args.edits };
        }
        return game;
      });

      return data.games.find((game) => game.id === args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at", url);
