import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  create(title: string, authorId: number) {
    return this.postModel.create({ title, authorId });
  }

  update(id: number, title: string) {
    return this.postModel.update({ title }, { where: { id } });
  }

  async delete(id: number) {
    const post = await this.postModel.findOne({ where: { id } });
    await post.destroy();
  }

  findAll() {
    return this.postModel.findAll({ raw: true });
  }
}
