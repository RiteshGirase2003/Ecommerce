import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
// import { Category } from '../schemas/product.schema';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly Pname: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly brand: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  
  // @IsEnum(Category, { message: 'Please enter correct category.' })
  // readonly category: Category;
  @IsArray()
  readonly category: string[];

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
