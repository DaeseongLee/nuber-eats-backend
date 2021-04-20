import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { CategoryResolover, RestaurantResolver } from './restraurants.resolver';
import { CategoryRepository } from './repositories/category.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
    providers: [RestaurantResolver, CategoryResolover, RestaurantService],
})
export class RestaurantsModule { }