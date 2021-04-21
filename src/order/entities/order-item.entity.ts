import { Dish } from './../../restraurants/entities/dish.entity';
import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from './../../common/entities/core.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemOption {
    @Field(type => String)
    name: string;
    @Field(type => String, { nullable: true })
    choice: string;
}



@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(type => Dish)
    @ManyToOne(type => Dish, { nullable: true, onDelete: 'CASCADE' })
    dish: Dish;

    @Field(type => [OrderItemOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options?: OrderItemOption[];
}