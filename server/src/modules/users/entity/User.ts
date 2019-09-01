import { Field, ObjectType } from "type-graphql";
import {
    Column, Entity, JoinColumn, OneToOne
} from "typeorm";
import { User as AccountsUser } from '@accounts/typeorm';
import { UserStatus, UserStatusReport } from '../@types';
import { UserMeeting } from "./UserMeeting";


@ObjectType()
@Entity()
export class User extends AccountsUser {
    @Column({ default: UserStatus.pending })
    @Field(type => String)
    status: UserStatus

    @Column({ default: UserStatusReport.pending })
    @Field(type => String)
    status_comment: UserStatusReport;

    @OneToOne(type => UserMeeting, { eager: true })
    @JoinColumn()
    user_meeting: UserMeeting;
}
