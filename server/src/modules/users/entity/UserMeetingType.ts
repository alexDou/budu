import { Field, Int, ObjectType } from "type-graphql";
import {
    Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { IsString } from "class-validator";

import { UserMeeting } from "./UserMeeting";
import { MeetingTypes } from "../@types";


@ObjectType()
@Entity({ name: 'user_meeting_type' })
export class UserMeetingType {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    @Field(type => String)
    @IsString()
    value: MeetingTypes;

    @ManyToOne(type => UserMeeting, user_meeting => user_meeting.meeting_type)
    user_meeting: UserMeeting;
}
