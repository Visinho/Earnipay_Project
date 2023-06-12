import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
import * as argon from "argon2";
import { SignInInput } from './dto/signin-input';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class AuthService {
  create: any;
  constructor(private prisma:PrismaService, private jwtService: JwtService, private configService: ConfigService){}
  async signup(signUpInput: SignUpInput) {
    const hashedPassword=await argon.hash(signUpInput.password);
    const user = await this.prisma.prismaUser.create({data: {username: signUpInput.username, hashedPassword: hashedPassword, email: signUpInput.email}});
    const { accessToken } =await this.createTokens(user.id, user.email);
    return { accessToken, user };
  }

  async signin(signInInput: SignInInput) {
    const user = await this.prisma.prismaUser.findUnique({
      where: { email: signInInput.email }
    });
    if(!user){
      throw new ForbiddenException("User does not exist!");
    }
    const passwordMatch = await argon.verify(user.hashedPassword, signInInput.password);

    if(!passwordMatch) {
      throw new ForbiddenException("Passwords do not match")
    }

    const { accessToken } = await this.createTokens(user.id, user.email);
    return { accessToken, user };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async createTokens(userId: number, email: string){
    const accessToken = this.jwtService.sign({
      userId, email
    }, {expiresIn: "10s", secret:this.configService.get("ACCESS_TOKEN_SECRET")});
    return { accessToken };
  }

  async logout(userId: number){
    await this.prisma.prismaUser.updateMany({
      where: { id: userId}
    });
    return { loggedOut: true};
  }
}
