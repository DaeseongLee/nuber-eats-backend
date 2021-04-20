import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() //graphQL decorator
@Entity() //Typeorm decorator
export class Restaurant extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field(type => String, { defaultValue: 'GangNam' })
    @Column()
    @IsString()
    address: string;

    @Field(type => Category, { nullable: true })
    @ManyToOne(
        type => Category,
        category => category.restaurants, { nullable: true, onDelete: 'SET NULL' }
    )
    category: Category;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants,
    )
    owner: User;

}
