import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { config } from 'dotenv';
config();

import {
    User, UserMeeting, UserMeetingLookFor, UserMeetingOpenFor, UserMeetingType, UserPhotos, UserRoles
} from '../../modules/users';
import { InvitationEntity } from "../../modules/invite";
import { ChatEntity, ChatMessagesEntity } from '../../modules/chat';
import { ReviewEntity } from '../../modules/review';
import { RatingEntity } from '../../modules/rating';
import { NotificationEntity } from '../../modules/notification';


const dbConnectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    name: 'pg-conn',
    url: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    // replication: { master: '', slave: '' },
    synchronize: true,
    logging: process.env.NODE_ENV === 'development' ? ['info'] :  ['error'],
    entities: [
        ...require('@accounts/typeorm').entities,
        User,
        UserMeeting,
        UserMeetingLookFor,
        UserMeetingOpenFor,
        UserMeetingType,
        UserPhotos,
        UserRoles,
        InvitationEntity,
        ChatEntity,
        ChatMessagesEntity,
        ReviewEntity,
        RatingEntity,
        NotificationEntity,
    ],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};

export default () => {
    return createConnection(dbConnectionOptions)
        .then(connection => {
            return connection;
        })
        .catch(e => {
            throw e;
        });
};
