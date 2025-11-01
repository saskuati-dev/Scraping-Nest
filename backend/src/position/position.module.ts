import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Position])],
  exports: [TypeOrmModule], // 👈 exporta o repositório


})
export class PositionModule {}
