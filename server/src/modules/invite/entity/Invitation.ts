import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { IsString, IsDateString, Length } from 'class-validator';

import { UserMeeting } from '../../users';
import { ChatEntity } from '../../chat';
import { ReviewEntity } from '../../review';
import { MeetingTypes } from '../../users/@types';


@ObjectType()
@Entity({ name: 'invite' })
export class InvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(type => UserMeeting, user_meeting => user_meeting.invite_sent)
  from: UserMeeting;

  @ManyToOne(type => UserMeeting, user_meeting => user_meeting.invite_incoming)
  to: UserMeeting;

  @Column()
  @Field(type => String)
  @IsString()
  type: MeetingTypes;

  @Column()
  @Field(type => String)
  @IsString()
  place: string;

  @Column({ nullable: true })
  @Field(type => String)
  @Length(10, 4000)
  @IsString()
  anything: string;

  @Column()
  @Field(type => Date)
  @Length(2, 254)
  @IsDateString()
  time: Date;

  @Column()
  @Field(type => String)
  @Length(6, 20)
  @IsString()
  status: string;

  @OneToOne(type => ChatEntity)
  @JoinColumn()
  chat: ChatEntity;

  @OneToMany(type => ReviewEntity, review => review.invitation, {
    eager: true
  })
  review: ReviewEntity[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  updatedAt?: Date;
}
