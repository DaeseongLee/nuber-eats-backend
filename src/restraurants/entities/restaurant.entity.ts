import { Dish } from './dish.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from './category.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, ObjectType, InputType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Order } from 'src/order/entities/order.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() //graphQL decorator
@Entity() //Typeorm decorator
export class Restaurant extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    coverImg?: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => Category, { nullable: true })
    @ManyToOne(
        type => Category,
        category => category.restaurants, { eager: true, nullable: true, onDelete: 'SET NULL' },
    )
    category: Category;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants,
        { onDelete: 'CASCADE' },
    )
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )
    menu: Dish[];

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.restaurant,
    )
    orders: Order[];

    @Field(type => Boolean, { nullable: true })
    @Column({ nullable: true })
    isPromoted?: boolean;

    @Field(type => Date, { nullable: true })
    @Column({ nullable: true })
    promotedUntil?: Date;

}
