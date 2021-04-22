import { UserRole } from './../users/entities/user.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { DishOption } from 'src/restraurants/entities/dish.entity';
import { Dish } from './../restraurants/entities/dish.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './../restraurants/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';


@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Dish) private readonly dishies: Repository<Dish>,
    ) { }

    async createOrder(customer: User, { restaurantId, items }: CreateOrderInput): Promise<CreateOrderOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                };
            };

            let orderFinalPrice = 0;
            const orderItems: OrderItem[] = [];

            for (const item of items) {  //forEach안에서는 return이 작동안함/
                const dish = await this.dishies.findOne(item.dishId);
                if (!dish) {
                    return {
                        ok: false,
                        error: 'Dish not found',
                    }
                };

                let dishFinalPrice = dish.price;
                for (const itemOption of item.options) {
                    const dishOption = dish.options.find(
                        dishOption => dishOption.name === itemOption.name,
                    );
                    if (dishOption) {
                        if (dishOption.extra) {
                            dishFinalPrice = dishFinalPrice + dishOption.extra;
                        } else {
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice => optionChoice.name === itemOption.choice,
                            );

                            if (dishOptionChoice) {
                                if (dishOptionChoice.extra) {
                                    dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                                }
                            }
                        }
                    }
                }
                orderFinalPrice = orderFinalPrice + dishFinalPrice;
                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish,
                        options: item.options
                    })
                );
                orderItems.push(orderItem);
                await this.orders.save(
                    this.orders.create({
                        customer,
                        restaurant,
                        total: orderFinalPrice,
                        items: orderItems,
                    })
                );
                return {
                    ok: true,
                };
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not create order',
            }
        }
    };

    async getOrders(user: User, { status }: GetOrdersInput): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];
            if (user.role === UserRole.Client) {
                orders = await this.orders.find({
                    where: {
                        customer: user,
                        ...(status && { status }),
                    },
                });
            } else if (user.role === UserRole.Delivery) {
                orders = await this.orders.find({
                    where: {
                        driver: user,
                        ...(status && { status }),
                    },
                });
            } else if (user.role === UserRole.Owner) {
                const restaurant = await this.restaurants.find({
                    where: {
                        owner: user
                    },
                    relations: ['orders']
                });
                orders = restaurant.map(restaurant => restaurant.orders).flat(1);
                if (status) {
                    orders = orders.filter(order => order.status === status);
                }
            }
            console.log('orders!!!', orders);
            return {
                ok: true,
                orders,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not get orders',
            }
        }
    };

    async getOrder(user: User, { id: orderId }: GetOrderInput): Promise<GetOrderOutput> {
        try {
            const order = await this.orders.findOne(orderId, {
                relations: ['restaurant'],
            });
            if (!order) {
                return {
                    ok: false,
                    error: 'Order not found.',
                };
            };
            let canSee = true;
            console.log('user.role', user.role);
            console.log('order.customerId', order.customerId);
            console.log('order.driverId', order.driverId);
            console.log('order.restaurant.ownerId', order.restaurant.ownerId);
            console.log('user.id', user.id);
            if (user.role === UserRole.Client && order.customerId !== user.id) {
                canSee = false;
            };
            if (user.role === UserRole.Delivery && order.driverId !== user.id) {
                canSee = false;
            };
            if (user.role === UserRole.Owner &&
                order.restaurant.ownerId !== user.id
            ) {
                canSee = false;
            };

            if (!canSee) {
                return {
                    ok: false,
                    error: 'You cant see that',
                };
            };
            console.log('order', order);
            return {
                ok: true,
                order,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not get Order',
            }
        }
    }
}