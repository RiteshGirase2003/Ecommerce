import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

// export enum Category {
//   ELECTRONICS = 'Electronics',
//   FASHION = 'Fashion',
//   HOME = 'Home',
//   BEAUTY = 'Beauty',
//   SPORTS = 'Sports',
//   HEALTH = 'Health',
//   BOOKS = 'Books',
//   TOYS = 'Toys',
//   AUTOMOTIVE = 'Automotive',
//   TOOLS = 'Tools',
// }

@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  Pname: string;

  @Prop()
  description: string;

  @Prop()
  brand: string;

  @Prop()
  price: number;

  // @Prop()
  // category: Category;
  @Prop({ type: [{ type: String }] })
  category : string[]


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

 