import { getRepository, Repository, getConnection, FindOneOptions } from 'typeorm';
import { Service } from 'typedi';

import { UserMeeting } from '../entity/UserMeeting';
import {
    UserRelationEntity, UserRelationFields
} from '../@types';


@Service()
export class UserMeetingRepository {
    private repository = getRepository(UserMeeting, 'pg-conn');

    async findOneById(_id: string) {
        return this.repository.findOne(_id);
    }

    async findOneBySelector(selector?: FindOneOptions<UserMeeting>) {
        return this.repository.findOne(selector);
    }

    async find(selector?: Partial<UserMeeting>) {
        return this.repository.find(selector);
    }

    async create(user: Partial<UserMeeting>) {
        return this.repository.save(user);
    }

    async update(_id: string, update: Partial<UserMeeting>) {
        const user = await this.findOneById(_id);
        await this.repository.merge(user, update);
        return this.repository.save(user);
    }

    async remove(_id: string) {
        const user = await this.repository.findOne(_id);
        return this.repository.remove(user);
    }
}

@Service()
export class UserBaseRelationsRepository {
    protected repository: Repository<UserRelationEntity>;

    constructor(protected entity: Function) {
        // prohibit direct access
        if (this.constructor.name == 'UserBaseRelationsRepository') {
            throw new Error('Direct access to User Base Relations Repository class prohibited');
        }
        // initialize proper repository
        this.repository = getRepository(entity);
    }

    async findById(_id: string) {
        return this.repository.findOne(_id);
    }

    async findByUserId(_id: string) {
        return await this.repository.find({ user_meeting: { id: _id } });
    }

    async save(_id: string, relationField: UserRelationFields, value: string) {
        const userMeetingRepo = new UserMeetingRepository();
        const userMeeting = await userMeetingRepo.findOneById(_id);

        const entityInstance = this.entity();
        entityInstance.value = value;

        userMeeting[relationField] = entityInstance;

        return this.repository.save(userMeeting);
    }

    async addRow(_id: string, value: string) {
        const userMeetingRepo = new UserMeetingRepository();
        const userMeeting = await userMeetingRepo.findOneById(_id);

        const row = {
            user_meeting: userMeeting,
            value
        };
        return this.repository.insert(row);
    }

    async addRowsBulk(_id: string, relationType: Function, values: string[]) {
        const userMeetingRepo = new UserMeetingRepository();
        const userMeeting = await userMeetingRepo.findOneById(_id);

        return getConnection()
            .createQueryBuilder()
            .insert()
            .into(relationType)
            .values(values.map(r => ({
                    user_meeting: userMeeting,
                    value: r
                })
            ))
            .execute();
    }

    async update(_id: string, value: string) {
        return this.repository.update(_id, { value })
    }

    async remove(_id: string) {
        const record = await this.findById(_id);
        return this.repository.remove(record);
    }
}

// export const UserRelationsRepository = (entity: Function) =>
//     helperMethodCallInterceptor(
//         new UserBaseRelationsRepository(entity),
//         (...args: any[]) => {
//             // expect last arg to be a relation payload
//             const value = args[args.length - 1];
//             if (value && typeof value === 'object') {
//                 args[args.length - 1] = JSON.stringify(value);
//             }
//
//             return args;
//         }
//     );
