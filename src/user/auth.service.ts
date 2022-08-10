import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    console.log('here in auth Service');

    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('User already exist');
    }

    const hash = await argon.hash(password);

    const user = await this.userService.create(email, hash);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }
    // console.log(user[0].password);

    const pwVerify = await argon.verify(user.password, password);

    if (!pwVerify) {
      throw new ForbiddenException('Invalid Credentilas');
    }

    delete user.password;
    return user;
  }
}
