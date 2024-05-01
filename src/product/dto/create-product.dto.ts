import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
// import { Category } from '../schemas/product.schema';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly Pname: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly brand: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  // @IsEnum(Category, { message: 'Please enter correct category.' })
  // readonly category: Category;
  @IsArray()
  readonly category: string[];

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
