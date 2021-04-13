import { UpdateRestaurantDto } from './dtos/update-resaurant.dto';
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
            console.log(createRestaurantDto);
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    @Mutation(returns => Boolean)
    async updateRestaurant(@Args('input') updateRestaurantDto: UpdateRestaurantDto): Promise<boolean> {
        try {
            await this.restaurantService.updateRestaurant(updateRestaurantDto);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
