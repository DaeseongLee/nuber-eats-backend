import { RestaurantService } from './restaurants.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }


    @Mutation(returns => Boolean)
    async createRestaurant(@Args('input') createRestaurantDto: CreateRestaurantDto): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
