import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
// import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new this.userModel({ email, password });
    await user.save();

    const token = this.jwtService.sign({ userId: user._id, email: user.email });
    return { token, user: { id: user._id, email: user.email } };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await this.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user._id, email: user.email });
    return { token, user: { id: user._id, email: user.email } };
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId);
  }

  private async validatePassword(
    plainPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, userPassword);
  }
}
