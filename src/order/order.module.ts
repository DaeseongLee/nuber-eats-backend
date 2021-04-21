import { OrderResolver } from './orders.resolver';
import { Order } from 'src/order/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrderService, OrderResolver],

})
export class OrderModule { }
