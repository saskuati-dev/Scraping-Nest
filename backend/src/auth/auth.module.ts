import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject:[ ConfigService],
      useFactory: (config: ConfigService)=>({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: {expiresIn: '7d'},
      })
    
    })
  ],

  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
