import { Field, ObjectType } from "type-graphql";
import {
    Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { IsString } from "class-validator";

import { Role } from "../@types";
import { UserMeeting } from "./UserMeeting";


@ObjectType()
@Entity({ name: 'user_roles' })
export class UserRoles {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    @Field(type => String)
    @IsString()
    value: Role;

    @ManyToOne(type => UserMeeting, user_meeting => user_meeting.roles)
    user_meeting: UserMeeting;
}
