import { UserMeeting } from './entity/UserMeeting';
import { UserRoles } from "./entity/UserRoles";
import { UserPhotos } from "./entity/UserPhotos";
import { UserMeetingType } from "./entity/UserMeetingType";
import { UserMeetingOpenFor } from "./entity/UserMeetingOpenFor";
import { UserMeetingLookFor } from "./entity/UserMeetingLookFor";
import { User } from "@accounts/typeorm";


export enum UserStatus {
    pending = 'pending',
    active = 'active',
    restricted = 'restricted',
    ban = 'ban',
    deleted = 'deleted'
}

export enum UserStatusReport {
    pending = 'Please, activate your account',
    active = 'Active account',
    restricted = 'Access restricted',
    ban = 'Account banned',
    deleted = 'Account deleted'
}

export enum Role {
    superadmin = 'superadmin',
    moderator = 'moderator',
    visitor = 'visitor',
    user = 'user',
}

export enum Gender {
    male = 'male',
    female = 'female'
}

export enum MeetingTypes {
    Dating = 'Dating',
    Coffee = 'Coffee',
    Beer = 'Beer',
    Sports = 'Sports',
    Walk = 'Walk',
    Pets = 'Pets',
    Distant = 'Distant' // phone, online, telepathy, screaming
}

export enum UserRelationFields {
    roles = 'roles',
    photos = 'photos',
    meeting_type = 'meeting_type',
    open_for = 'open_for',
    look_for = 'look_for'
}

export type UserRelationEntity =
    UserRoles
    | UserPhotos
    | UserMeetingType
    | UserMeetingOpenFor;

export interface UserContext {
    uid?: number
    user?: UserMeeting
    auth?: any
}

export interface Context {
    uid?: number
    user?: User
}

export type UserLookFor = {
    gender: Gender
    age: number
}

export interface UserRelationValue {
    value: string | UserLookFor
}
