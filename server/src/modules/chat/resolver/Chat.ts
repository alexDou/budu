import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx
} from 'type-graphql';

import { ChatEntity, ChatRepository } from '..';
import { ChatStatus } from '../@types';
import { Role, UserContext } from '../../users/@types';


@InputType()
export class ChatInput implements Partial<ChatEntity> {
    @Field(type => String)
    id: string;

    @Field(type => String)
    status: ChatStatus;

    @Field(type => String)
    status_report: string;
}

@Service()
@Resolver(ChatResolvers)
export default class ChatResolvers {
    constructor(private readonly repo: ChatRepository) {}

    @Query(returns => [ChatEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async chat(@Arg('cId', returns => String) cId: string) {
        const sent = await this.repo.find({ id: cId });
        return sent;
    }

    @Mutation(returns => ChatEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async updateChat (
        @Arg('cId', returns => String) cId: string,
        @Arg('chat', returns => ChatInput) chat: ChatInput,
        @Ctx() ctx: UserContext
    ) {
        // authentication maybe
        await this.repo.update(cId, chat);

        return await this.repo.findOneById(cId);
    }

    @Mutation(returns => ChatEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveChat (
        @Arg('chat', returns => ChatInput) invite: ChatInput,
        @Ctx() ctx: UserContext
    ) {
        // authentication ?
        return await this.repo.create(invite);
    }
}
