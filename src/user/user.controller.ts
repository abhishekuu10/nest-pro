import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  //   UseInterceptors,
  //   ClassSerializerInterceptor,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  // createUser(@Body() authDto: CreateUserDto) {
  //   return this.userService.create(authDto.email, authDto.password);
  // }
  signup(@Body() authDto: CreateUserDto) {
    console.log('here in controller');

    return this.authService.signup(authDto.email, authDto.password);
  }

  @Post('signin')
  async signin(@Body() authDto: CreateUserDto, @Session() session: any) {
    try {
      const user = await this.authService.signin(
        authDto.email,
        authDto.password,
      );
      session.userId = user.id;
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/signout')
  signout(@Session() session: any) {
    session.UserId = null;
  }

  //   for removing password from outgoing request
  //   @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    const user = this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
  }

  @Get()
  findALlUser(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
