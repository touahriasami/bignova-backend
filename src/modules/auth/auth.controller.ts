import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() { email, password }: LoginRequestDto) {
    return this.authService.register(email, password);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() { email, password }: LoginRequestDto) {
    return this.authService.login(email, password);
  }
}
