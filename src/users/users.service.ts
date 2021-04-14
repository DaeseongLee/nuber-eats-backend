import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>) { }

    async createAccount({ email, password, role }: CreateAccountInput) {
        try {
            const exists = await this.users.findOne({ email });
            if (exists) {
                return;
            }
            await this.users.save(this.users.create({ email, password, role }));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}