import { JwtService } from './../jwt/jwt.service';
import { LoginInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
    ) { }

    async createAccount({ email, password, role }: CreateAccountInput): Promise<[boolean, string?]> {
        try {
            const exists = await this.users.findOne({ email });
            if (exists) {
                return [false, 'There is user with that email already'];
            }
            const user = await this.users.save(this.users.create({ email, password, role }));
            await this.verifications.save(this.verifications.create({ user, }))
            return [true];

        } catch (error) {
            return [false, "Couldn't create account"];
        }
    }

    async login({ email, password }: LoginInput): Promise<{ ok: boolean, error?: string, token?: string }> {
        try {
            const user = await this.users.findOne(
                { email },
                { select: ['id', 'password'] },
            );
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

            const token = this.jwtService.sign(user.id);

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

    async findById(id: number): Promise<User> {
        return this.users.findOne({ id });
    }

    async editProfile(userId: number, { email, password }: EditProfileInput): Promise<User> {
        const user = await this.users.findOne(userId);
        if (email) {
            user.email = email;
            user.verified = false;
            await this.verifications.save(this.verifications.create({ user, }))
        }
        if (password) {
            user.password = password;
        }
        return this.users.save(user);
    }

    async verifyEmail(code: string): Promise<boolean> {
        try {
            const verification = await this.verifications.findOne(
                { code },
                // { loadRelationIds: true },
                { relations: ['user'] },
            );
            if (verification) {
                verification.user.verified = true;
                this.users.save(verification.user);
                return true;
            }
            throw new Error();
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}