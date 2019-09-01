import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Field, ObjectType, Int } from 'type-graphql';
import { IsString, Min, Max, IsDateString, Length, IsNumber } from 'class-validator';

import { InvitationEntity } from "../../invite";


@ObjectType()
@Entity({ name: 'reviews' })
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    /** ID of a user reviewing his counterpart  */
    @Column()
    @Field(type => String)
    @IsString()
    reviewer: string;

    /** ID of a user for whom the review was sent */
    @Column()
    @Field(type => String)
    @IsString()
    subject: string;

    @Column()
    @Field(type => Int)
    @Min(1)
    @Max(10)
    @IsNumber()
    grade: number;

    @Column({ nullable: true })
    @Field(type => String, { nullable: true })
    @Length(2, 2000)
    @IsString()
    review: string;

    @ManyToOne(type => InvitationEntity, invitation => invitation.review)
    invitation: InvitationEntity;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @UpdateDateColumn({type: 'timestamp'})
    @Field()
    @IsDateString()
    createdAt?: Date;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @Field()
    @IsDateString()
    updatedAt?: Date;
}