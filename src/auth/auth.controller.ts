import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: {username:string; email: string; password: string }) {
    return this.authService.signup(body.username,body.email, body.password);
  }

  @Post('signin')
  signin(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password);
  }
}
