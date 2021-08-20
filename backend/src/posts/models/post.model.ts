import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../auth/models/user.model';

@ObjectType()
@Table({ tableName: 'posts' })
export class Post extends Model {
  @PrimaryKey
  @Column
  @Field(() => ID)
  id: string;

  @Column
  @Field()
  title: string;

  @ForeignKey(() => User)
  @Column('number')
  authorId: User['id'];

  @BelongsTo(() => User)
  author: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
