import { PaymentService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { Resolver } from '@nestjs/graphql';


@Resolver(of => Payment)
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) { }
}