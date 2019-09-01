import { Field, ObjectType } from "type-graphql";
import {
    Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { IsString } from "class-validator";

import { MeetingTypes } from "../@types";
import { UserMeeting } from "./UserMeeting";


@ObjectType()
@Entity({ name: 'user_meeting_open_for' })
export class UserMeetingOpenFor {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    @Field(type => String)
    @IsString()
    value: MeetingTypes;

    @ManyToOne(type => UserMeeting, user_meeting => user_meeting.open_for)
    user_meeting: UserMeeting;
}