import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { IsString, IsDateString, Length } from 'class-validator';

import { ChatStatus } from '../@types';
import { ChatMessagesEntity } from './ChatMessages';


@ObjectType()
@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'enum', enum: ChatStatus, default: ChatStatus.idle })
  @Field(type => String)
  @Length(4, 6)
  @IsString()
  status: ChatStatus;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @Length(10, 400)
  @IsString()
  status_report: string;

  @OneToMany(type => ChatMessagesEntity, chat_messages => chat_messages.chat, {
    eager: true
  })
  chat_messages?: ChatMessagesEntity[];

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  @Field()
  @IsDateString()
  createdAt?: Date;
}
