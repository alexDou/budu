import { Field, ObjectType } from "type-graphql";
import {
    Column, Entity, PrimaryGeneratedColumn
} from "typeorm";
import { IsJSON } from "class-validator";


@ObjectType()
@Entity({ name: 'user_meeting_look_for' })
export class UserMeetingLookFor {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ default: '{}' })
    @Field(type => String)
    @IsJSON()
    value: string;
}
