import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async check(username): Promise<boolean> {
    const user = await this.usersService.findOne(username);
    return !!user;
  }

  async resetPassword(username: string, newPassword: string) {
    return this.usersService.resetPassword(username, newPassword);
  }

  async register(username: string, pass: string): Promise<any> {
    console.log('register user with data:', { username, pass });
    return this.usersService.create(username, pass);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log('user', user);
    if (user && user.password === pass) {
      console.log('logged in');
      const { password, ...result } = user;
      const payload = { username: user.username, sub: user.id };
      result.token = await this.jwtService.signAsync(payload);
      console.log('result.token', result.token);
      return result;
    }
    throw new UnauthorizedException();
  }
}
