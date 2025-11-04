import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ScrapingService } from './scraping/scraping.service';
import { ScrapingModule } from './scraping/scraping.module';
import { ItemsModule } from './items/items.module';
import { PositionModule } from './position/position.module';
ConfigModule.forRoot()

@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
})
,
    AuthModule, ItemsModule,
    ConfigModule.forRoot({isGlobal: true}), ScrapingModule, ItemsModule, PositionModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScrapingService],
})
export class AppModule {}
