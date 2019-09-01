import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Ctx, InputType, Field, Int, UnauthorizedError
} from 'type-graphql';

import { User, UserRepository } from '..';
import { Role, UserContext } from '../@types';
import { CreateUserInput } from "@accounts/graphql-api";
import { UserStatus, UserStatusReport } from '../@types';


@InputType()
export class UserUpdateInput implements CreateUserInput, Partial<User> {
    @Field(type => String)
    username: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    status: UserStatus;

    @Field(type => String)
    status_comment: UserStatusReport;
}

@Service()
@Resolver(UserResolvers)
export default class UserResolvers {
    constructor(private readonly repo: UserRepository) {}

    @Query(returns => User)
    @Authorized(Role.superadmin || Role.moderator)
    async getUser(
        @Arg('userId', returns => String) userId: string,
    ) {
        return await this.repo.findOne(userId);
    }

    @Query(returns => [User])
    @Authorized()
    async users() {
        const all = await this.repo.find();
        return all;
    }

    @Mutation(returns => User)
    @Authorized()
    async updateUser (
        @Arg('userId', returns => String) userId: string,
        @Arg('user', returns => UserUpdateInput) user: CreateUserInput,
        @Ctx() ctx: UserContext
    ) {
        if (userId !== ctx.user.id) {
            throw new UnauthorizedError();
        }

        return await this.repo.update(userId, user);
    }
}
