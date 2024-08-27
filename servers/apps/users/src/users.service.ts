import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prismaService';
import { Response } from 'express';
import * as bcryp from 'bcrypt';
import { UserData } from './types/user.types';
import { EmailService } from './email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isUserExist) throw new BadRequestException('Email already exists');

    const phoneNumbersToCheck = [phone_number];

    const usersWithPhoneNumber = await this.prisma.user.findMany({
      where: {
        phone_number: {
          not: null,
          in: phoneNumbersToCheck,
        },
      },
    });

    if (usersWithPhoneNumber.length > 0)
      throw new BadRequestException('Phone number already exists');

    const hashedPassword = await bcryp.hash(password, 10);

    const user: UserData = {
        name,
        email,
        password: hashedPassword,
        phone_number,
      }

      const activationToken = await this.createActivationToken(user);
      const activationCode = activationToken.activationCode;

      await this.emailService.sendMail({
        email,
        subject: 'Activate your account!',
        template: '../../../email-templates/activation-mail',
        name,
        activationCode,
      });




    return [user, response];
  }

  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // for now
    const user = {
      email,
      password,
    };
    return user;
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
