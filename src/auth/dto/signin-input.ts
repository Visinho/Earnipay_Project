import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SignInInput {


  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
