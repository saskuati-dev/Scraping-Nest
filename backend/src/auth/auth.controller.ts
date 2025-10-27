import { Body, Controller, Post, BadRequestException} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){

    }
    @Post('signup')
    signUp(@Body() body: any){
        const { name, email, password, is_adm } = body;
        
        if (!name || !email || !password) {
            throw new BadRequestException('Name, email and password are required');
        }
        
        return this.authService.signUp(name, email, password, is_adm || false);
    }

    @Post('signin')
    signIn(@Body() body: any){
        const {email, password } = body;
        
        if ( !email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        
        return this.authService.signIn(email, password);
    }
}
