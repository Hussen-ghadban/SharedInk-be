import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(username:string, email: string, password: string,profile:string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile,
      },
    });

    return {
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signin(email: string, password: string) { 
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.jwt.signAsync(
      { id: user.id, username: user.username },
    );

    return {
      message: 'Signed in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
  async getuser(userId:string){
    return await this.prisma.user.findUnique({
      where:{id:userId},
      select:{
        id:true,
        email:true,
        username:true,
        profile:true,
      }
    })
  }
}
