import { Dish } from './../../restraurants/entities/dish.entity';
import { Restaurant } from './../../restraurants/entities/restaurant.entity';
import { ObjectType, InputType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';


export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User,
        user => user.orders,
        { onDelete: 'SET NULL', nullable: true }
    )
    customer?: User;

    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User,
        user => user.rides,
        { onDelete: 'SET NULL', nullable: true }
    )
    driver?: User;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.orders,
        { onDelete: 'SET NULL', nullable: true },
    )
    restaurant: Restaurant;

    @Field(type => Dish)
    @ManyToMany(type => Dish)
    @JoinTable()
    dishes: Dish[];

    @Field(type => Float, { nullable: true })
    @Column({ nullable: true })
    total?: number;

    @Field(type => OrderStatus)
    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus
}