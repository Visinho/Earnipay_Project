import { ObjectType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

@ObjectType()
export class User {
    @Field(() => Int)
    id: number;

    @IsNotEmpty()
    @IsString()
    @Field()
    username: string;

    @Field()
    email: string;
}