import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orders: Repository<Order>) { }
}