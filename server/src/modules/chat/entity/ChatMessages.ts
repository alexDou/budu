import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { IsString, Length } from 'class-validator';

import { ChatEntity } from './Chat';


@ObjectType()
@Entity({ name: 'chat' })
export class ChatMessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    // userMeeting ID (relation is at the InvitationEntity)
    @Column()
    @Field(type => String)
    @IsString()
    author: string;

    @Column()
    @Field(type => String)
    @Length(10, 2000)
    @IsString()
    message: string;

    @ManyToOne(type => ChatEntity, chat => chat.chat_messages)
    chat: ChatEntity;
}
