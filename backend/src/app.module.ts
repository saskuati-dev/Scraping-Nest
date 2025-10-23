import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
ConfigModule.forRoot()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',host: 'localhost',             
      port: 5432,                  
      username: process.env.DB_USERNAME,        
      password: process.env.DB_PASSWORD,     
      database: process.env.DB_DATABASE,     
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  
      logging: true,

    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
