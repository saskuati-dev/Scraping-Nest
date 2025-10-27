import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/current-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('items')
export class ItemsController {

    @Get('public')
    getPublic(){
        return 'public';
    };

    @Get('private')
    @UseGuards(JwtAuthGuard)
    getPrivate(@CurrentUser() user: CurrentUserDto){
        return `private\nUser: ${user.username}`;
    }
}
