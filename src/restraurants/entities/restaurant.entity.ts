import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType() //graphQL decorator
@Entity() //Typeorm decorator
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ default: true })
    @IsOptional()
    @IsBoolean()
    isVegan: boolean;

    @Field(type => String, { defaultValue: 'GangNam' })
    @Column()
    @IsString()
    address: string;
}
