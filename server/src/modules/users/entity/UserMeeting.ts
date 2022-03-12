import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@accounts/typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { IsString, IsInt, IsEnum, Length, Min, Max } from 'class-validator';

import { Gender } from '../@types';
import { UserRoles } from './UserRoles';
import { UserPhotos } from './UserPhotos';
import { UserMeetingType } from './UserMeetingType';
import { UserMeetingOpenFor } from './UserMeetingOpenFor';
import { UserMeetingLookFor } from './UserMeetingLookFor';
import { InvitationEntity } from "../../invite";
import { RatingEntity } from "../../rating/entity/Rating";


@ObjectType()
@Entity({ name: 'user_meeting' })
export class UserMeeting {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  
  @Column()
  @Field(type => String)
  @Length(3, 60)
  @IsString()
  publicName: string;

  @Column()
  @Field(type => String)
  @IsEnum(Gender)
  gender: Gender;

  @Column()
  @Field(type => Int)
  @Min(10)
  @Max(120)
  @IsInt()
  age: number;

  @Column()
  @Field(type => String)
  @Length(2, 254)
  @IsString()
  geoposition: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  anything?: string;

  @OneToOne(type => User)
  user: User;

  @OneToMany(type => UserRoles, user_roles => user_roles.user_meeting, {
    eager: true
  })
  roles: UserRoles[];

  @OneToMany(type => UserPhotos, user_photos => user_photos.user_meeting, {
    eager: true
  })
  photos: UserPhotos[];

  @OneToMany(type => UserMeetingType, user_meeting_type => user_meeting_type.user_meeting, {
    eager: true
  })
  meeting_type: UserMeetingType[];

  @OneToMany(type => UserMeetingOpenFor, user_meeting_open_for => user_meeting_open_for.user_meeting, {
    eager: true
  })
  open_for: UserMeetingOpenFor[];

  @OneToOne(type => UserMeetingLookFor, {
    eager: true
  })
  @JoinColumn()
  look_for: UserMeetingLookFor;

  @OneToMany(type => InvitationEntity, invite => invite.from)
  invite_sent: InvitationEntity[];

  @OneToMany(type => InvitationEntity, invite => invite.to)
  invite_incoming: InvitationEntity[];

  @OneToMany(type => RatingEntity, profile => profile.user)
  rating: RatingEntity[];
}
