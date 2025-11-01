import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from 'src/position/position.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position]), 
    AuthModule, 
JwtModule.register({}) 
  ],
  controllers: [ItemsController],
  providers: [ItemsService],

})
export class ItemsModule {}
