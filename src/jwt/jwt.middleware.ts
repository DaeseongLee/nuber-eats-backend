import { UserService } from './../users/users.service';
import { JwtService } from './jwt.service';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class jwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService,
        private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            try {
                const decoded = this.jwtService.verify(token.toString()); // { id: 3, iat: 1618404902 }
                if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {

                    const { user, ok } = await this.userService.findById(decoded['id']);
                    if (ok) {
                        req['user'] = user;
                    }
                }
            } catch (error) {
                console.error('error!!!', error);
            }
        }
        next();
    }
}

// export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
//     console.log(req.headers);
//     next();
// }