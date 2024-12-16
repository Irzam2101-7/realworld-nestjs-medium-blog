import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity('claps')
@Unique(['article_id', 'user_id']) // Ensure a user can clap for an article only once
export class ClapEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => ArticleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'int', default: 1 })
  counter: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
