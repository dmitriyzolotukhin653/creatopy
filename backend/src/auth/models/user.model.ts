import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../../posts/models/post.model';

@ObjectType()
@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Column
  @Field(() => ID, { nullable: true })
  id!: number;

  @Column
  @Field()
  username!: string;

  @Column
  password!: string;

  @CreatedAt
  @Field()
  createdAt!: string;

  @UpdatedAt
  updatedAt!: string;

  @HasMany(() => Post)
  posts: Post[];

  @Field({ nullable: true })
  token?: string;
}
