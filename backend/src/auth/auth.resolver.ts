import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { LoginArgs } from './dto/login.args';
import { AuthService } from './services/auth.service';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CheckUsernameArgs } from './dto/check-username.args';
import { ResetPasswordInput } from './dto/reset-password.input';
import { RegisterInput } from './dto/register.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Boolean)
  async checkUsername(
    @Args() { username }: CheckUsernameArgs,
  ): Promise<boolean> {
    return this.authService.check(username);
  }

  @Query(() => User)
  async login(@Args() { username, password }: LoginArgs): Promise<User> {
    return this.authService.validateUser(username, password);
  }

  @Mutation(() => User)
  async register(
    @Args('input') { username, password }: RegisterInput,
  ): Promise<User> {
    const isExists = await this.authService.check(username);
    if (isExists) {
      throw new UnprocessableEntityException();
    }
    return this.authService.register(username, password);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('input') { username, newPassword }: ResetPasswordInput,
  ): Promise<boolean> {
    const isExists = await this.authService.check(username);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.authService.resetPassword(username, newPassword);
    return true;
  }
}
