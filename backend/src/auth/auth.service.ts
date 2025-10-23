import { Injectable, ConflictException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    async singup(email:string, password: string){}


}
