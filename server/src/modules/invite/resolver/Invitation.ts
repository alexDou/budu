import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx
} from 'type-graphql';

import { InvitationEntity, InvitationRepository } from '..';
import { Role, UserContext } from '../../users/@types';
import { UserMeeting } from '../../users';
import { UserMeetingInput } from '../../users';
import { MeetingTypes } from '../../users/@types';


@InputType()
export class InviteInput implements Partial<InvitationEntity> {
    @Field(type => UserMeetingInput)
    from!: UserMeeting;

    @Field(type => UserMeetingInput)
    to!: UserMeeting;

    @Field(type => String)
    type: MeetingTypes

    @Field(type => String)
    place: string;

    @Field(type => String)
    anything: string;

    @Field(type => Date)
    time: Date;

    @Field(type => String)
    status: string;
}

@Service()
@Resolver(InvitationResolvers)
export default class InvitationResolvers {
    constructor(private readonly repo: InvitationRepository) {}

    @Query(returns => [InvitationEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_invites_sent(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ from: { id: userId } as UserMeeting });
        return sent;
    }

    @Query(returns => [InvitationEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_invites_incoming(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ to: { id: userId } as UserMeeting });
        return sent;
    }

    @Query(returns => InvitationEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async inviteById(@Arg('iId', returns => String) iId: string) {
        const userMeeting = await this.repo.findOneById(iId);
        return userMeeting;
    }

    @Query(returns => InvitationEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async inviteByTypeAndUser(
        @Arg('userId', returns => String) userId: string,
        @Arg('type', returns => String) type: string,
        @Arg('inviter', returns => Boolean) inviter: boolean
    ) {
        const part = inviter ? 'from' : 'to';
        const userMeeting = await this.repo.find({ [part]: { id: userId } as UserMeeting, type: type as MeetingTypes });
        return userMeeting;
    }

    @Mutation(returns => InvitationEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async updateInvite (
        @Arg('iId', returns => String) iId: string,
        @Arg('invite', returns => InviteInput) invite: InviteInput,
        @Ctx() ctx: UserContext
    ) {
        await this.repo.update(iId, invite);

        return await this.repo.findOneById(iId);
    }

    @Mutation(returns => InvitationEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveInvite (
        @Arg('invite', returns => InviteInput) invite: InviteInput,
        @Ctx() ctx: UserContext
    ) {
        return await this.repo.create(invite);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.superadmin || Role.moderator)
    async withdrawInvite (
        @Arg('iId', returns => String) iId: string,
        @Ctx() ctx: UserContext
    ) {
        return this.repo.remove(iId);
    }

}
