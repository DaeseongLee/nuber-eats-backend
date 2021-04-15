import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constant';
import { JwtModuleOptions } from './jwt.interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,) { }

    sign(userId: number): string {
        console.log("jwtId", userId);
        return jwt.sign({ id: userId }, this.options.privateKey)
    }

    verify(token: string) {
        return jwt.verify(token, this.options.privateKey);
    }
}
