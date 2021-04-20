import { PaginationInput, PaginationOutput } from './../../common/dtos/pagination.dto';
import { Category } from './../entities/category.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, Field, ObjectType } from "@nestjs/graphql";

@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
    @Field(type => Category, { nullable: true })
    category?: Category;
}