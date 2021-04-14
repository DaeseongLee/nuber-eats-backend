import { LoginInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>,
        private readonly config: ConfigService
    ) { }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<[boolean, string?]> {
        try {
            const exists = await this.users.findOne({ email });
            if (exists) {
                return [false, 'There is user with that email already'];
            }
            await this.users.save(this.users.create({ email, password, role }));
            return [true];

        } catch (error) {
            return [false, "Couldn't create account"];
        }
    }

    async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        try {
            const user = await this.users.findOne({ email });
            if (!user) {
                return {
                    ok: false,
                    error: 'User not Found',
                }
            }
            const passwordCorrect = await user.checkPassword(password);

            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: 'Wrong password',
                }
            }
            const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
            return {
                ok: true,
                token,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }

    }


}