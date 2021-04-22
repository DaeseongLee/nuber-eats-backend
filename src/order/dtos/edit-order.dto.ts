import { Order } from 'src/order/entities/order.entity';
import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) { }

@ObjectType()
export class EditOrderOutput extends CoreOutput { }