import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Clap } from '@src/articles/dto/clap.dto';
import { ClapEntity } from '@src/articles/infrastructure/persistence/relational/entities/clap.entity';
import { ClapMapper } from '@src/articles/infrastructure/persistence/relational/mappers/clapMapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class ClapRelationalRepository {
  constructor(
    @InjectRepository(ClapEntity)
    private readonly clapRepository: Repository<ClapEntity>,
  ) {}

  // Create a new clap or increment existing one
  async create(data: Partial<Clap>): Promise<Clap> {
    const persistenceModel = ClapMapper.toPersistence(data as any);

    const newEntity = await this.clapRepository.save(
      this.clapRepository.create(persistenceModel),
    );

    return ClapMapper.toDomain(newEntity);
  }

  // Find a clap by user and article IDs
  async findClap(
    userId: string,
    articleId: string,
  ): Promise<NullableType<Clap>> {
    const entity = await this.clapRepository.findOne({
      where: {
        user: { id: Number(userId) },
        article: { id: articleId },
      },
      relations: ['user', 'article'],
    });

    return entity ? ClapMapper.toDomain(entity) : null;
  }

  // Update the clap count
  async update(id: Clap['id'], counter: number): Promise<Clap> {
    const updatedEntity = await this.clapRepository.save(
      this.clapRepository.create({
        id,
        counter,
      }),
    );

    return ClapMapper.toDomain(updatedEntity);
  }

  // Paginate claps for a specific article
  async findClapsForArticle({
    paginationOptions: { limit, page },
    articleId,
  }: {
    paginationOptions: IPaginationOptions;
    articleId: Clap['article']['id'];
  }): Promise<[Clap[], number]> {
    const [entities, total] = await this.clapRepository.findAndCount({
      where: { article: { id: articleId } },
      relations: ['user', 'article'],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const claps = entities.map((entity) => ClapMapper.toDomain(entity));
    return [claps, total];
  }

  // Remove a clap by ID
  async remove(id: Clap['id']): Promise<void> {
    await this.clapRepository.delete(id);
  }
}
