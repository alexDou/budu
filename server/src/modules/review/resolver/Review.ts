import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx, Int
} from 'type-graphql';

import { ReviewEntity, ReviewRepository } from '..';
import { Role, UserContext } from '../../users/@types';
import { InvitationEntity } from '../../invite';
import { InviteInput } from '../../invite';


@InputType()
export class ReviewInput implements Partial<ReviewEntity> {
    @Field(type => String)
    id: string

    @Field(type => InviteInput)
    invitation: InvitationEntity;

    @Field(type => String)
    reviewer!: string;

    @Field(type => String)
    subject: string;

    @Field(type => Int)
    grade: number;

    @Field(type => String)
    review: string;
}

@Service()
@Resolver(ReviewResolvers)
export default class ReviewResolvers {
    constructor(private readonly repo: ReviewRepository) {}

    @Query(returns => [ReviewEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_reviews_sent(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ reviewer: userId });
        return sent;
    }

    @Query(returns => [ReviewEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async user_reviews_incoming(@Arg('userId', returns => String) userId: string) {
        const sent = await this.repo.find({ subject: userId });
        return sent;
    }

    @Mutation(returns => ReviewEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async updateReview (
        @Arg('rId', returns => String) rId: string,
        @Arg('review', returns => ReviewInput) review: ReviewInput,
        @Ctx() ctx: UserContext
    ) {
        await this.repo.update(rId, review);

        return await this.repo.findOneById(rId);
    }

    @Mutation(returns => ReviewEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveReview (
        @Arg('review', returns => ReviewInput) review: ReviewInput,
        @Ctx() ctx: UserContext
    ) {
        return await this.repo.create(review);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.superadmin || Role.moderator)
    async withdrawReview (
        @Arg('rId', returns => String) rId: string,
        @Ctx() ctx: UserContext
    ) {
        return this.repo.remove(rId);
    }

}
