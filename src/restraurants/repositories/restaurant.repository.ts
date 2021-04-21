import { Category } from './../entities/category.entity';
import { Restaurant } from './../entities/restaurant.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
    async findPagedRestaurant(page: number, category: Category = null): Promise<[Restaurant[], number?]> {
        const [restaurants, count] = await this.findAndCount(
            {

                where: { category },
                take: 25,
                skip: (page - 1) * 25
            },
        )
        return [restaurants, count]
    }
}