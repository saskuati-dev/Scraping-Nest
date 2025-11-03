import { Injectable, ConflictException , BadRequestException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,            
    ) {}

    async signUp(name: string, email: string, password: string, role:('user' | 'admin')[] = ['user']){
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('Email inválido');
        }
        
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email já está em uso');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password, salt, 32) as Buffer;
        const saltAndHash = `${salt}.${hash.toString('hex')}`;

        const user = this.userRepository.create({
            name,
            email,
            password: saltAndHash,
            role
        })

        await this.userRepository.save(user);
        return user; 

    }

    async signIn(email:string, password:string){
        const user = await this.userRepository.findOne({
            where: { email }
        })
        
        if(!user){
            throw new UnauthorizedException("User or password are invalids, try again");
        }

        const [salt, storedHash] = user.password.split(".");

        const hash = await scrypt(password, salt, 32) as Buffer;

        if(storedHash != hash.toString("hex")){
            throw new UnauthorizedException("User or password are invalids, try again");
        }

        const payload = {username:user.name, email: user.email, sub: user.id, role: user.role}

        return {user: user,accessToken: this.jwtService.sign(payload)};
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }



}
