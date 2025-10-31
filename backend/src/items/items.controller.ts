    import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/current-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('items')
export class ItemsController {

    @Get('')
    getPublicFeature() {
        return 'This is a public feature';
    }

    @Post()
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    getPrivateFeature(@CurrentUser() user: CurrentUserDto) {
        return `This is a private feature for user ${user.username}`;
    }
}
