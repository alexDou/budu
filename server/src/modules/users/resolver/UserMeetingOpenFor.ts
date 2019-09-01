import { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';

import { UserBaseRelationsRepository, UserMeetingRepository } from '../repo/UserMeeting';
import { UserMeetingOpenFor } from '../entity/UserMeetingOpenFor';
import { Role, UserContext, UserRelationFields } from '../@types';
import { helperCheckRole } from "../../../helpers";


@Service()
@Resolver(UserMeetingOpenForResolvers)
export default class UserMeetingOpenForResolvers {
    private repo: UserBaseRelationsRepository;

    constructor() {
        this.repo = new UserBaseRelationsRepository(UserMeetingOpenFor);
    }

    @Mutation(returns => UserMeetingOpenFor)
    @Authorized(Role.superadmin || Role.moderator)
    async updateUserPhoto (
        @Arg('ofId', returns => String) ofId: string,
        @Arg('open_for', returns => String) open_for: string,
        @Ctx() ctx: UserContext
    ) {
        const userMeetingOpenFor = await this.repo.findById(ofId);

        // only owner user, superadmin, and moderator can update a user
        helperCheckRole(userMeetingOpenFor.user_meeting, ctx, [Role.superadmin, Role.moderator]);

        await this.repo.update(ofId, open_for);

        return await this.repo.findById(ofId);
    }

    @Mutation(returns => UserMeetingOpenFor)
    @Authorized(Role.superadmin || Role.moderator)
    async saveUserOpenFor (
        @Arg('userId', returns => String) userId: string,
        @Arg('open_for', returns => String) open_for: string,
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

        return await this.repo.save(userId, UserRelationFields.meeting_type, open_for);
    }
}
