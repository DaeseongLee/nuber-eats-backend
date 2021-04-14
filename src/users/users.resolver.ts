import { User } from './entities/user.entity';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';


@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UserService) { }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const [ok, error] = await this.usersService.createAccount(createAccountInput);
            return {
                ok,
                error
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return await this.usersService.login(loginInput);

        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }
}