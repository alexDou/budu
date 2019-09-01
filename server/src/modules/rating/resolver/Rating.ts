import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx, Float
} from 'type-graphql';

import { RatingEntity, RatingRepository } from '..';
import { Role, UserContext } from '../../users/@types';
import { UserMeeting, UserMeetingInput } from '../../users';


@InputType()
export class RatingInput implements Partial<RatingEntity> {
    @Field(type => String)
    id: string

    @Field(type => UserMeetingInput)
    user: UserMeeting;

    @Field(type => Float)
    rating: number;
}

@Service()
@Resolver(RatingResolvers)
export default class RatingResolvers {
    constructor(private readonly repo: RatingRepository) {}

    @Query(returns => [RatingEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_rating(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ user: { id: userId } as UserMeeting });
        return sent;
    }

    @Mutation(returns => RatingEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async updateRating (
        @Arg('rId', returns => String) rId: string,
        @Arg('rating', returns => RatingInput) rating: RatingInput,
        @Ctx() ctx: UserContext
    ) {
        await this.repo.update(rId, rating);

        return await this.repo.findOneById(rId);
    }

    @Mutation(returns => RatingEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveRating (
        @Arg('rating', returns => RatingInput) rating: RatingInput,
        @Ctx() ctx: UserContext
    ) {
        return await this.repo.create(rating);
    }
}
