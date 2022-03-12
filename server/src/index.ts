import path from 'path';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {mergeTypeDefs, mergeResolvers, mergeSchemas} from '@graphql-tools/merge';
import {buildSchema, NonEmptyArray} from 'type-graphql';
import {GraphQLUpload, graphqlUploadExpress} from 'graphql-upload';
import {Container} from 'typedi';
import {Connection} from "typeorm";
import pino from 'pino';
import {config} from 'dotenv';

config({path: path.join(__dirname, '../.env')});

import {setUpAccounts} from './modules/users/accounts';
import connect from './services/db';
import loggerInit from './services/logger';
import {
  UserResolvers,
  UserMeetingResolvers,
  UserMeetingTypeResolvers,
  UserRolesResolvers,
  UserPhotosResolvers,
  UserMeetingOpenForResolvers,
  UserMeetingLookForResolvers,
} from './modules/users';
import {InvitationResolvers} from './modules/invite';
import {ChatResolvers, ChatMessagesResolvers} from './modules/chat';
import {ReviewResolvers} from './modules/review';
import {RatingResolvers} from './modules/rating';
import {NotificationResolvers} from './modules/notification';
import UserTypeDefs from './modules/users/schema/user_gql_types';
// import InviteTypeDefs from './modules/invite/schema/invite_gql_types';
// import ChatTypeDefs from './modules/chat/schema/chat_gql_types';
// import ReviewTypeDefs from './modules/review/schema/review_gql_types';
// import RatingTypeDefs from './modules/rating/schema/rating_gql_types';
// import NotificationTypeDefs from './modules/notification/schema/notification_gql_types';
import {authChecker} from './modules/users/authChecker';


const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty'
  },
  options: {
    colorize: true
  }
});
const {PORT = 8080, HOST = 'localhost'} = process.env;
const gqlPath = '/data';
const app = express();

try {
  // initialize logger service
  loggerInit(app, path.join(__dirname, '/logs'));

  // connect to postgres DB and start the GraphQL thing
  connect()
    .then(async (connection: Connection) => {
      // combine all resolvers
      const typeGraphqlResolvers = [
        UserResolvers,
        UserMeetingResolvers,
        UserMeetingTypeResolvers,
        UserRolesResolvers,
        UserPhotosResolvers,
        UserMeetingOpenForResolvers,
        UserMeetingLookForResolvers,
        InvitationResolvers,
        ChatResolvers,
        ChatMessagesResolvers,
        ReviewResolvers,
        RatingResolvers,
        NotificationResolvers,
      ] as NonEmptyArray<Function>;

      const typeGraphqlSchema = await buildSchema({
        resolvers: typeGraphqlResolvers,
        container: Container,
        validate: false,
        emitSchemaFile: true,
        authChecker,
      });

      const {accountsGraphQL} = setUpAccounts(connection as Connection);

      const schema = makeExecutableSchema({
        typeDefs: mergeTypeDefs([
          'scalar Upload',
          UserTypeDefs,
          accountsGraphQL.typeDefs,
          // InviteTypeDefs,
          // ChatTypeDefs,
          // ReviewTypeDefs,
          // RatingTypeDefs,
          // NotificationTypeDefs,
        ]),
        resolvers: {
          Upload: GraphQLUpload,
          ...mergeResolvers([accountsGraphQL.resolvers])
        },
        schemaDirectives: {
          ...accountsGraphQL.schemaDirectives,
        },
      });

      // Create the Apollo Server that takes a schema and configures internal stuff
      const server = new ApolloServer({
        schema: mergeSchemas({
          schemas: [schema, typeGraphqlSchema],
        }),
        // to force these to be enabled in production this can be set to `true`
        introspection: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
        plugins: [
          process.env.ENABLE_GRAPHQL_PLAYGROUND &&
          ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        context: accountsGraphQL.context,
        formatError: err => {
          logger.error(err);
          logger.error('Stacktrace:');
          logger.error(
            err.extensions && err.extensions.exception && err.extensions.exception.stacktrace
          );

          return err;
        },
      });

      app.use(bodyParser.urlencoded({extended: true}));
      app.use(bodyParser.json({type: 'application/json'}));

      // adds a zlib based compression
      app.use(compression());

      // allow request from all hosts in demo purposes
      // to limit it by origin of the react app, cors({ origin: 'http://reactapp.com', credentials: true })
      app.use(cors({origin: '*'}));

      // handle GraphQL uploads
      app.use(graphqlUploadExpress({
        maxFileSize: 10 * 1000 * 1000, // 10 MB
        maxFiles: 10,
      }));

      await server.start();
      server.applyMiddleware({app, path: gqlPath});

      // eventually start the server
      app.set('port', PORT);
      app.listen(app.get('port'), HOST, (): void => {
        logger.info(`Listening on :${PORT} with GQL running on ${server.graphqlPath} ..`);
      });
    })
    .catch(e => {
      throw e;
    });
} catch (err) {
  logger.error((new Date).toUTCString(), ' App Init Exception:', err.message);
  logger.error(err.stack);
  process.exit(1);
}

process.on('uncaughtException', function (err): void {
  logger.error((new Date).toUTCString(), ' uncaughtException:', err.message);
  logger.error(err.stack);
  process.exit(1);
});
