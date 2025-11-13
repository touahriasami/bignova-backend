import { IsEmail, IsSemVer, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
