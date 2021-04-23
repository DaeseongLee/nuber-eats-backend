import { Payment } from './../../payments/entities/payment.entity';
import { Restaurant } from './../../restraurants/entities/restaurant.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(type => String)
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Field(type => String)
    @Column({ select: false })
    @IsString()
    password: string;

    @Field(type => UserRole)
    @Column({ type: 'enum', enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.owner,
    )
    restaurants: Restaurant[];

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.customer
    )
    orders: Order[];

    @Field(type => [Payment])
    @OneToMany(
        type => Payment,
        payment => payment.user,
        { eager: true },
    )
    payments: Payment[];

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.driver
    )
    rides: Order[];


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (error) {
                console.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}