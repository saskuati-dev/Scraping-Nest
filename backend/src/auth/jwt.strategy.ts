import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
            secretOrKey: config.getOrThrow('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        })
    }

    async validate(payload: any){
        return {userId: payload.sub, username: payload.username};
    }

}