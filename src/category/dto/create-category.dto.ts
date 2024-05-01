import {
    IsEmpty,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  import { User } from '../../auth/schemas/user.schema';
  
  export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    readonly category: string;
  
    @IsNotEmpty()
    @IsString()
    readonly description: string;
  
    
  
    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;
  }
  