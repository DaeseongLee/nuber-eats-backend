import { CoreOutput } from './../../common/dtos/output.dto';
import { Payment } from './../entities/payment.entity';
import { InputType, ObjectType, PickType } from "@nestjs/graphql";


@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId', 'restaurantId']) { }

@ObjectType()
export class CreatePaymentOutput extends CoreOutput { };
