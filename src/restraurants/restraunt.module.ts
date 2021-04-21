import { Dish } from './entities/dish.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { CategoryResolover, DishResolver, RestaurantResolver } from './restraurants.resolver';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository, RestaurantRepository])],
    providers: [RestaurantResolver, CategoryResolover, DishResolver, RestaurantService],
})
export class RestaurantsModule { }