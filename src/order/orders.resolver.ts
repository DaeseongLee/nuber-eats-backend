import { AuthUser } from './../auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderService } from './orders.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Order } from 'src/order/entities/order.entity';
import { Role } from 'src/auth/role.decorator';




@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(@AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
        return this.orderService.createOrder(customer, createOrderInput);
    }
}