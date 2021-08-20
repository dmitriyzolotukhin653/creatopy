import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthResolver, AuthService, UsersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
