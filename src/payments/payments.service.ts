import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './../restraurants/entities/restaurant.entity';
import { Payment } from './entities/payment.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';

@Injectable()
export class PaymentService {
    constructor(@InjectRepository(Payment) private readonly payments: Repository<Payment>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>
    ) { }

    async createPayment(owner: User, { transactionId, restaurantId }: CreatePaymentInput): Promise<CreatePaymentOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                };
            };
            if (restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: 'You are not allowed to do this.',
                };
            };
            await this.payments.save(
                this.payments.create({
                    transactionId,
                    user: owner,
                    restaurant,
                })
            );
            return {
                ok: true,
            };

        } catch (error) {
            return {
                ok: false,
                error: 'Could not create payment.',
            }
        }
    };
    async getPayments(user: User): Promise<GetPaymentsOutput> {
        try {
            const payments = await this.payments.find({ user: user });
            return {
                ok: true,
                payments,
            };
        } catch {
            return {
                ok: false,
                error: 'Could not load payments.',
            };
        }
    }
}