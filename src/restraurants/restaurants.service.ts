import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { Dish } from './entities/dish.entity';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Raw, Repository } from "typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishies: Repository<Dish>,
        @InjectRepository(Category)
        private readonly categories: CategoryRepository,
        @InjectRepository(Restaurant)
        private readonly pagedRestaurants: RestaurantRepository,
    ) { }


    async createRestaurant(owner: User, createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName);
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not create restaurant',
            }
        }
    }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
                editRestaurantInput.restaurantId
            );
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't edit a restaurant that you don't own",
                }
            }
            let category: Category = null;
            if (editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName
                );
            }

            await this.restaurants.save([
                {
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && { category })
                },
            ]);

            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not edit Restaurant',
            }
        }
    };

    async deleteRestaurant(owner: User, { restaurantId }: DeleteRestaurantInput): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't delete a restaurant that you don't own",
                }
            }

            await this.restaurants.delete(restaurantId)
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not delete Restaurant',
            }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Cound not load categories',
            }
        }
    }

    countRestaurants(category: Category) {
        return this.restaurants.count({ category });
    }

    async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({ slug });
            if (!category) {
                return {
                    ok: false,
                    error: 'Category Not Found',
                };
            };
            const restaurants = await this.restaurants.find(
                {
                    where: { category },
                    take: 25,
                    skip: (page - 1) * 25
                },
            )
            const totalResults = await this.countRestaurants(category);
            return {
                ok: true,
                category,
                restaurants,
                totalPages: Math.ceil(totalResults / 25)
            };
        } catch (error) {
            return {
                ok: false,
                error: "Could not load category",
            }
        }
    }

    async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
        try {

            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 25,
                take: 25,
            });
            // const [restaurants, totalResults] = await this.pagedRestaurants.findPagedRestaurant(page);
            // console.log(restaurants, totalResults);
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 25),
                totalResults
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not load restaurants',
            }
        }
    }

    async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId, {
                relations: ['menu'],
            });
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            }
            return {
                ok: true,
                restaurant,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not find restaurant',
            }
        }
    }

    async searchRestaurantByName({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    // name: Like(`%${query}%`),
                    name: Raw(name => `${name} ILIKE '%${query}%'`),

                },
                skip: (page - 1) * 25,
                take: 25,
            });
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 25),
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not search for restaurants',
            }
        }
    }

    async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
        try {
            const restaurant = await this.restaurants.findOne(createDishInput.restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't do that.",
                }
            }
            await this.dishies.save(this.dishies.create({ ...createDishInput, restaurant }));
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not create dish',
            }
        }
    }

    async checkDishOwner(ownerId: number, dishId: number) { }

    async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
        try {
            const dish = await this.dishies.findOne(editDishInput.dishId, {
                relations: ['restaurant'],
            });
            if (!dish) {
                return {
                    ok: false,
                    error: 'Dish not found',
                };
            };
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "You can't do that.",
                }
            }

            await this.dishies.save([
                {
                    id: editDishInput.dishId,
                    ...editDishInput,
                }
            ]);
            return {
                ok: true,
            };
        } catch (error) {
            return {
                ok: false,
                error: 'Could not edit dish',
            }
        }
    }

    async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
        try {
            const dish = await this.dishies.findOne(dishId, {
                relations: ['restaurant'],
            });
            if (!dish) {
                return {
                    ok: false,
                    error: 'Dish not found',
                };
            };
            if (dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "You can't do that.",
                }
            }

            await this.dishies.delete(dishId);
            return {
                ok: true,
            };

        } catch (error) {
            return {
                ok: false,
                error: 'Could not delete dish',
            }
        }
    }
}