import { PaymentResolver } from './payments.resolver';
import { Restaurant } from './../restraurants/entities/restaurant.entity';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
    providers: [PaymentService, PaymentResolver]
})
export class PaymentsModule { }
