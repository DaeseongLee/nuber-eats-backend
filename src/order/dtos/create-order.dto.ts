import { CoreOutput } from './../../common/dtos/output.dto';
import { Order } from 'src/order/entities/order.entity';
import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";

@InputType()
export class CreateOrderInput extends PickType(Order, ['dishes']) {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput { };