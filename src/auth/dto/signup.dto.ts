import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User, UserRoles } from '../schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRoles, { message: 'Please enter correct Role.' })
  readonly role : UserRoles;
}
