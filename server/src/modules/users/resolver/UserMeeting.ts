import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx, Int
} from 'type-graphql';

import { UserMeetingRepository } from '../repo/UserMeeting';
import { UserMeeting } from '../entity/UserMeeting';
import { Role, Gender, UserContext } from '../@types';
import { helperCheckRole } from "../../../helpers";

@InputType()
export class UserInput implements Partial<UserMeeting> {
    @Field(type => String)
    arbitraryName: string;

    @Field(type => String)
    gender: Gender;

    @Field(type => Int)
    age: number;

    @Field(type => String)
    geoposition: string;

    @Field(type => String)
    phone: string;
}

@Service()
@Resolver(UserMeetingResolvers)
export default class UserMeetingResolvers {
    constructor(private readonly repo: UserMeetingRepository) {}

    @Query(returns => [UserMeeting])
    @Authorized()
    async usersMeeting() {
        const all = await this.repo.find();
        return all;
    }

    @Query(returns => UserMeeting)
    @Authorized()
    async userMeetingById(@Arg('userId', returns => String) userId: string) {
        const userMeeting = await this.repo.findOneById(userId);
        return userMeeting;
    }

    @Mutation(returns => UserMeeting)
    @Authorized()
    async updateUserMeeting (
        @Arg('umId', returns => String) umId: string,
        @Arg('user_meeting', returns => UserInput) user_meeting: UserInput,
        @Ctx() ctx: UserContext
    ) {
        const userRecord = await this.repo.findOneById(umId);

        // only owner user, superadmin, and moderator can update a user
        helperCheckRole(userRecord, ctx, [Role.superadmin, Role.moderator]);

        await this.repo.update(umId, user_meeting);

        return await this.repo.findOneById(umId);
    }
}
