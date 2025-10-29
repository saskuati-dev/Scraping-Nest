import { Controller, Get, UseGuards, Request, Post, Body, ForbiddenException} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/current-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('items')
export class ItemsController {



    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    postItemAdm(){
        return "Admin";
    }
}
