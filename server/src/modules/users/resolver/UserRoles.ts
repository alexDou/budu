import { Service } from 'typedi';
import {
    Arg, Resolver, Authorized, Mutation, Ctx
} from 'type-graphql';

import { UserBaseRelationsRepository, UserMeetingRepository } from '../repo/UserMeeting';
import { UserRoles } from '../entity/UserRoles';
import { Role, UserContext, UserRelationFields } from '../@types';
import { helperCheckRole } from "../../../helpers";


@Service()
@Resolver(UserRolesResolvers)
export default class UserRolesResolvers {
    private repo: UserBaseRelationsRepository;

    constructor() {
        this.repo = new UserBaseRelationsRepository(UserRoles);
    }

    @Mutation(returns => UserRoles)
    @Authorized(Role.superadmin || Role.moderator)
    async updateUserRole (
        @Arg('roleId', returns => String) roleId: string,
        @Arg('role', returns => String) role: string,
        @Ctx() ctx: UserContext
    ) {
        const userRole = await this.repo.findById(roleId);

        // only owner user, superadmin, and moderator can update a user
        helperCheckRole(userRole.user_meeting, ctx, [Role.superadmin, Role.moderator]);

        await this.repo.update(roleId, role);

        return await this.repo.findById(roleId);
    }

    @Mutation(returns => UserRoles)
    @Authorized(Role.superadmin || Role.moderator)
    async saveUserRole (
        @Arg('userId', returns => String) userId: string,
        @Arg('role', returns => String) role: string,
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

        return await this.repo.save(userId, UserRelationFields.roles, role);
    }
}
