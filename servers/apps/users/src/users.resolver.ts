import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterResponse } from './types/user.types';
import { RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';

@Resolver('User')
// @UseFilters()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { response: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name)
      throw new BadRequestException('please provide all required fields');
    const user = await this.usersService.register(registerDto, context.response);
    console.log('register user', user);
    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUsers();
  }
}
