import { Service } from 'typedi';
import {
    Arg, Resolver, Query, Authorized, Mutation, Field, InputType, Ctx
} from 'type-graphql';

import { ChatEntity, ChatMessagesEntity, ChatRepository, ChatMessagesRepository } from '..';
import { Role, UserContext } from '../../users/@types';
import { ChatInput } from './Chat';


@InputType()
export class ChatMessagesInput implements Partial<ChatMessagesEntity> {
    @Field(type => String)
    author: string;

    @Field(type => String)
    message: string;

    @Field(type => ChatInput)
    chat: ChatEntity
}

@Service()
@Resolver(ChatMessagesResolvers)
export default class ChatMessagesResolvers {
    constructor(private readonly repo: ChatMessagesRepository) {}

    @Query(returns => [ChatMessagesEntity])
    @Authorized(Role.superadmin || Role.moderator)
    async chat_messages(@Arg('chatId', returns => String) chatId: string) {
        const sent = await this.repo.find({ chat: { id: chatId } as ChatEntity });
        return sent;
    }

    @Mutation(returns => ChatMessagesEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async updateChatMessage (
        @Arg('cmId', returns => String) cmId: string,
        @Arg('chat_messages', returns => ChatMessagesInput) chat: ChatMessagesInput,
        @Ctx() ctx: UserContext
    ) {
        // authentication maybe
        await this.repo.update(cmId, chat);

        return await this.repo.findOneById(cmId);
    }

    @Mutation(returns => ChatMessagesEntity)
    @Authorized(Role.superadmin || Role.moderator)
    async saveChatMessage (
        @Arg('chatId', returns => String) chatId: string,
        @Arg('chat_message', returns => ChatMessagesInput) chat_message: ChatMessagesInput,
        @Ctx() ctx: UserContext
    ) {
        // authentication ?
        const chatRepo = new ChatRepository();
        const chat = await chatRepo.findOneById(chatId);
        chat_message.chat = chat;
        return await this.repo.create(chat_message);
    }

    @Mutation(returns => Boolean)
    @Authorized(Role.superadmin || Role.moderator)
    async removeChatMessage (
        @Arg('cmId', returns => String) cmId: string,
        @Ctx() ctx: UserContext
    ) {
        // authentication ?
        return await this.repo.remove(cmId);
    }
}
