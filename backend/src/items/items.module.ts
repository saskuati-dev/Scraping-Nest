import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ItemsController]
})
export class ItemsModule {

  
}
