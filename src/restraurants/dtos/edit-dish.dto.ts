import { Dish } from './../entities/dish.entity';
import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
    'name',
    'options',
    'price',
    'description',
]) {
    @Field(type => Int)
    dishId: number;
};

@ObjectType()
export class EditDishOutput extends CoreOutput { }