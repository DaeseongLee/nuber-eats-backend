import { UserResolver } from './../users/users.resolver';
import { JwtService } from './../jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { AllowedRoles } from './role.decorator';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
        if (!roles) { //roles가 없으면 public resolver
            return true;
        };

        const gqlContext = GqlExecutionContext.create(context).getContext();
        const token = gqlContext.token;
        if (token) {
            const decoded = this.jwtService.verify(token.toString());
            if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                const { user } = await this.userService.findById(decoded['id']);
                if (user) {
                    gqlContext['user'] = user;
                    if (roles.includes('Any')) {
                        return true;
                    }
                    return roles.includes(user.role);
                }
            }
        }
        return false;
    }
}