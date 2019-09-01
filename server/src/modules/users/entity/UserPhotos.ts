import { Field, Int, ObjectType } from "type-graphql";
import {
    Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { IsString } from "class-validator";

import { UserMeeting } from "./UserMeeting";


@ObjectType()
@Entity({ name: 'user_photos' })
export class UserPhotos {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    @Field(type => String)
    @IsString()
    value: string;

    @ManyToOne(type => UserMeeting, user_meeting => user_meeting.photos)
    user_meeting: UserMeeting;
}
