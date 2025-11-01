import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from '../position/position.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position]),
    AuthModule, 
    JwtModule.register({}) 
  ],

  controllers: [ScrapingController],
  providers: [ScrapingService],

})
export class ScrapingModule {}
