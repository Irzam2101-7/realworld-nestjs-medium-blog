import { Clap } from '@src/articles/dto/clap.dto';
import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { ClapEntity } from '@src/articles/infrastructure/persistence/relational/entities/clap.entity';
import { ArticleMapper } from '@src/articles/infrastructure/persistence/relational/mappers/article.mapper';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class ClapMapper {
  static toDomain(raw: ClapEntity): Clap {
    const domainEntity = new Clap();
    domainEntity.id = raw.id;
    domainEntity.counter = raw.counter;

    // Convert the nested user and article entities if they exist
    if (raw.article) {
      domainEntity.article = ArticleMapper.toDomain(raw.article);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    // property names (createdAt and updatedAt)
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Clap): ClapEntity {
    const persistenceEntity = new ClapEntity();

    // Map required fields from domain entity to persistence entity
    if (domainEntity.id !== undefined) {
      persistenceEntity.id = domainEntity.id.toString();
    }

    if (domainEntity.counter !== undefined) {
      persistenceEntity.counter = domainEntity.counter;
    }

    // Handle user entity mapping, only if user is present
    if (domainEntity.user) {
      persistenceEntity.user = new UserEntity();
      persistenceEntity.user.id = Number(domainEntity.user.id);
    }

    // Handle article entity mapping, only if article is present
    if (domainEntity.article) {
      persistenceEntity.article = new ArticleEntity();
      persistenceEntity.article.id = domainEntity.article.id.toString();
    }

    // Fix property names (createdAt and updatedAt)
    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
