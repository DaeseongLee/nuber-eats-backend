import { Restaurant } from './../entities/restaurant.entity';
import { PaginationInput, PaginationOutput } from './../../common/dtos/pagination.dto';
import { Category } from './../entities/category.entity';
import { InputType, Field, ObjectType } from "@nestjs/graphql";

@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
    @Field(type => [Restaurant])
    restaurants?: Restaurant[];

    @Field(type => Category, { nullable: true })
    category?: Category;
}