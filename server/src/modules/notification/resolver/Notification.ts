import {Service} from 'typedi';
import {Arg, Authorized, Ctx, Field, InputType, Mutation, Query, Resolver} from 'type-graphql';

import { NotificationEntity, NotificationRepository } from '..';
import { UserMeeting, UserMeetingInput } from "../../users";
import { NotificationStatus, NotificationType } from '../@types'
import { Role, UserContext } from '../../users/@types';


@InputType()
export class NotificationInput implements Partial<NotificationEntity> {
    @Field(type => String)
    id: string

    @Field(type => String)
    type: NotificationType;

    @Field(type => String)
    details: string;

    @Field(type => String)
    message: string;

    @Field(type => String)
    status: NotificationStatus;

    @Field(type => UserMeetingInput)
    user: UserMeeting;
}

@Service()
@Resolver(NotificationResolvers)
export default class NotificationResolvers {
    constructor(private readonly repo: NotificationRepository) {}

    @Query(returns => [NotificationEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_notifications(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ user: { id: userId } as UserMeeting, status: NotificationStatus.pending });
        return sent;
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.superadmin || Role.moderator)
    async updateNotificationStatus (
        @Arg('nId', returns => String) nId: string,
        @Arg('status', returns => String) status: NotificationStatus,
        @Ctx() ctx: UserContext
    ) {
        return await this.repo.update(nId, { status });
    }

    @Mutation(returns => NotificationEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveNotification (
        @Arg('notification', returns => NotificationInput) notification: NotificationInput,
        @Ctx() ctx: UserContext
    ) {
        return await this.repo.create(notification);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.superadmin || Role.moderator)
    async removeNotification (
        @Arg('nId', returns => String) nId: string,
        @Ctx() ctx: UserContext
    ) {
        return this.repo.remove(nId);
    }
}
