import { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';

import { UserBaseRelationsRepository, UserMeetingRepository } from '../repo/UserMeeting';
import { UserMeetingType } from '../entity/UserMeetingType';
import { Role, UserContext, UserRelationFields } from '../@types';
import { helperCheckRole } from "../../../helpers";


@Service()
@Resolver(UserMeetingTypeResolvers)
export default class UserMeetingTypeResolvers {
    private repo: UserBaseRelationsRepository;

    constructor() {
        this.repo = new UserBaseRelationsRepository(UserMeetingType);
    }

    @Mutation(returns => UserMeetingType)
    @Authorized(Role.superadmin || Role.moderator)
    async updateUserPhoto (
        @Arg('mtId', returns => String) mtId: string,
        @Arg('meeting_type', returns => String) meeting_type: string,
        @Ctx() ctx: UserContext
    ) {
        const userMeetingType = await this.repo.findById(mtId);

        // only owner user, superadmin, and moderator can update a user
        helperCheckRole(userMeetingType.user_meeting, ctx, [Role.superadmin, Role.moderator]);

        await this.repo.update(mtId, meeting_type);

        return await this.repo.findById(mtId);
    }

    @Mutation(returns => UserMeetingType)
    @Authorized(Role.superadmin || Role.moderator)
    async saveUserMeetingType (
        @Arg('userId', returns => String) userId: string,
        @Arg('meeting_type', returns => String) meeting_type: string,
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

        return await this.repo.save(userId, UserRelationFields.meeting_type, meeting_type);
    }
}
