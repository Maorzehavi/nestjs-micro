import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prismaService';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto, response: Response){
    const {name, email, password} = registerDto
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      }
    });
    return [user, response]
  }


  async login(loginDto: LoginDto){
    const {email, password} = loginDto
    // for now
    const user = {
      email,
      password,
    };
    return user;
  }

  async getUsers(){
    return this.prisma.user.findMany();
  }
}
