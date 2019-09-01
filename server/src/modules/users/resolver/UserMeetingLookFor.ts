import { Service } from 'typedi';
import {Arg, Authorized, Ctx, Int, Mutation, Resolver} from 'type-graphql';

import { UserBaseRelationsRepository, UserMeetingRepository } from '../repo/UserMeeting';
import { UserMeetingLookFor } from '../entity/UserMeetingLookFor';
import { Role, UserContext, UserRelationFields } from '../@types';
// import { helperCheckRole } from "../../../helpers";


@Service()
@Resolver(UserMeetingLookForResolvers)
export default class UserMeetingLookForResolvers {
    private repo: UserBaseRelationsRepository;

    constructor() {
        this.repo = new UserBaseRelationsRepository(UserMeetingLookFor);
    }

    @Mutation(returns => UserMeetingLookFor)
    @Authorized(Role.superadmin || Role.moderator)
    async updateUserLookFor (
        @Arg('lfId', returns => String) lfId: string,
        @Arg('gender', returns => String) gender: string,
        @Arg('age', returns => Int) age: number,
        @Ctx() ctx: UserContext
    ) {
        const look_for = JSON.stringify({ gender, age });

        await this.repo.update(lfId, look_for);

        return await this.repo.findById(lfId);
    }

    @Mutation(returns => UserMeetingLookFor)
    @Authorized(Role.superadmin || Role.moderator)
    async saveUserLookFor (
        @Arg('userId', returns => String) userId: string,
        @Arg('gender', returns => String) gender: string,
        @Arg('age', returns => Int) age: number,
        @Ctx() ctx: UserContext
    ) {
        if (ctx.user.id !== userId) {
            const userMeetingRepository = new UserMeetingRepository();
            const userMeeting = await userMeetingRepository.findOneBySelector({ where: { user: ctx.user } });

            userMeeting.roles.forEach(role => {
                if ([Role.superadmin, Role.moderator].includes(role.value as Role)) {
                    throw new Error('Access denied. Unsufficient access rights');
                }
            });
        }

        const look_for = JSON.stringify({ gender, age });

        return await this.repo.save(userId, UserRelationFields.look_for, look_for);
    }
}
