import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { IsString, IsDateString, Length } from 'class-validator';

import { UserMeeting } from "../../users";
import { NotificationType, NotificationStatus } from '../@types';


@ObjectType()
@Entity({ name: 'notification' })
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Field(type => String)
    @Length(4, 8)
    @IsString()
    type: NotificationType;

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    @Length(2, 254)
    @IsString()
    details: string

    @Column()
    @Field(type => String)
    @Length(2, 400)
    @IsString()
    message: string

    @Column()
    @Field(type => String)
    @Length(4, 8)
    @IsString()
    status: NotificationStatus

    @OneToOne(type => UserMeeting, user_meeting => user_meeting.rating)
    user: UserMeeting;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @Field()
    @IsDateString()
    updatedAt?: Date;
}
