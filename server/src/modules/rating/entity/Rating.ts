import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Field, ObjectType, Float } from 'type-graphql';
import { Min, Max, IsDateString } from 'class-validator';

import { UserMeeting } from "../../users";


/** make it manyToOne relation to users
 to keep track on user' history ratings
 so, each time we update a user rating it would be a new row */
@ObjectType()
@Entity({ name: 'rating' })
export class RatingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Field(type => Float)
    @Min(0)
    @Max(100)
    rating: number;

    @ManyToOne(type => UserMeeting, user_meeting => user_meeting.rating)
    user: UserMeeting;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @Field()
    @IsDateString()
    createdAt?: Date;
}
