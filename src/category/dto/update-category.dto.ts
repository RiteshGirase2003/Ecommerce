import {
    IsEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { User } from '../../auth/schemas/user.schema';
  
  export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    readonly category: string;
  
    @IsOptional()
    @IsString()
    readonly description: string;
  
    
  
    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;
  }
  