import {Service} from 'typedi';
import {Arg, Authorized, Ctx, Mutation, Resolver} from 'type-graphql';

import { UserBaseRelationsRepository, UserMeetingRepository } from '../repo/UserMeeting';
import { UserPhotos } from '../entity/UserPhotos';
import { Role, UserContext, UserRelationFields } from '../@types';
import { helperCheckRole } from "../../../helpers";


@Service()
@Resolver(UserPhotosResolvers)
export default class UserPhotosResolvers {
    private repo: UserBaseRelationsRepository;

    constructor() {
        this.repo = new UserBaseRelationsRepository(UserPhotos);
    }

    @Mutation(returns => UserPhotos)
    @Authorized(Role.superadmin || Role.moderator)
    async updateUserPhoto (
        @Arg('photoId', returns => String) photoId: string,
        @Arg('photo', returns => String) photo: string,
        @Ctx() ctx: UserContext
    ) {
        const userPhoto = await this.repo.findById(photoId);

        // only owner user, superadmin, and moderator can update a user
        helperCheckRole(userPhoto.user_meeting, ctx, [Role.superadmin, Role.moderator]);

        await this.repo.update(photoId, photo);

        return await this.repo.findById(photoId);
    }

    @Mutation(returns => UserPhotos)
    @Authorized(Role.superadmin || Role.moderator)
    async saveUserPhoto (
        @Arg('userId', returns => String) userId: string,
        @Arg('photo', returns => String) photo: string,
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

        return await this.repo.save(userId, UserRelationFields.photos, photo);
    }
}
