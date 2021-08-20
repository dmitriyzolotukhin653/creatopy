import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async resetPassword(username: string, password: string) {
    return this.userModel.update(
      {
        username,
        password,
      },
      { where: { username } },
    );
  }

  async create(username: string, password: string) {
    return this.userModel.create({ username, password });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: {
        username,
      },
      raw: true,
    });
  }
}
