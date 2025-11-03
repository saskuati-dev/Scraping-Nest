import { Controller, Get, Query, Param, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Position } from 'src/position/position.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 12,
        @Query('source') source?: string,
        @Query('query') query?: string,
    ) {
        return this.itemsService.findAll(Number(page), Number(pageSize), source, query);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.itemsService.findOne(Number(id));
    }

    @Post()
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    async create(@Body() data: Partial<Position>) {
        return this.itemsService.create(data);
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() data: Partial<Position>) {
        return this.itemsService.update(Number(id), data);
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number) {
        return this.itemsService.remove(Number(id));
    }
}
