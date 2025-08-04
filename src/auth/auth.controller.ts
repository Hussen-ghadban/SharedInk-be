import { Controller, Post, Body, UseGuards, Get, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { cloudinaryStorage } from 'src/utils/cloudinary-storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private prisma: PrismaService,) {}

  @Post('signup')
  signup(@Body() body: {username:string; email: string; password: string,profile:string }) {
    return this.authService.signup(body.username,body.email, body.password,body.profile);
  }

  @Post('signin')
  signin(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password);
  }

  @Get('get-user')
  @UseGuards(JwtAuthGuard)
  getuser(@Req() req){
    const userId = req.user.id;
    return this.authService.getuser(userId)
  }

  @Post('upload-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async uploadProfile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const imageUrl = file.path; // public Cloudinary URL
    const userId = req.user.id;

    // Save to DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { profile: imageUrl },
    });

    return {
      message: 'Profile image updated successfully',
      imageUrl,
    };
  }
}
