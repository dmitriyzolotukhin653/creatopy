import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
