import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { Position } from 'src/position/position.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async findAll(page = 1, pageSize = 10, source?: string, query?: string) {
    const where: any = {};
    if (source) where.source = source;
    if (query) {
      where.rawPayload = Raw(
    alias => `CAST(${alias} AS TEXT) ILIKE :query`,
    { query: `%${query}%` }
  );

    }

    const [data, total] = await this.positionRepository.findAndCount({
      where,
      order: { post_date: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    return this.positionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: Partial<Position>) {
    await this.positionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async create(data: Partial<Position>) {
    const entity = this.positionRepository.create(data);
    return this.positionRepository.save(entity);
  }

  async remove(id: number) {
    return this.positionRepository.delete(id);
  }
}
