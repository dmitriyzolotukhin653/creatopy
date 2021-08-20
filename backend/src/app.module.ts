import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { User } from './auth/models/user.model';
import path from 'path';
import { Post } from './posts/models/post.model';

const root: string = path.resolve(__dirname, '..');

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: `${root}/data/test.sqlite`,
      models: [User, Post],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
