import { makeExecutableSchema } from "@graphql-tools/schema";
import { createYoga } from "graphql-yoga";
import { Server, createServer } from "http";

export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    user(id: ID!): User
  }
`;

export const resolvers = {
  Query: {
    user: (_: any, args: any) => {
      return {
        id: args.id,
        name: "gqlpt",
      };
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({ schema });

export function startServer({ port }: { port: number }): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = createServer(yoga);

    server.on("error", (err) => {
      console.error(err);
      reject(err);
    });

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      resolve(server);
    });
  });
}
