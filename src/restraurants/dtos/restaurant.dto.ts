import { Restaurant } from './../entities/restaurant.entity';
import { PaginationInput, PaginationOutput } from './../../common/dtos/pagination.dto';
import { Field, InputType, ObjectType } from "@nestjs/graphql";


@InputType()
export class RestaurantInput extends PaginationInput { }

@ObjectType()
export class RestaurantOutput extends PaginationOutput {
    @Field(type => [Restaurant])
    results?: Restaurant[];
}