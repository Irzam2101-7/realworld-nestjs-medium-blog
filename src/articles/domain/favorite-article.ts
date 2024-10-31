import { ApiProperty } from '@nestjs/swagger';

import { User } from '@src/users/domain/user';

import { Article } from './article';

export class FavoriteArticle {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  follower: User;

  @ApiProperty()
  following: Article;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
