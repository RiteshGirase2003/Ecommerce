import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}


  // GET : Find ALL Products

  async findAll(query: Query): Promise<Product[]> {
    const resPerPage = Number(query.limit) || 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const products = await this.productModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return products;
  }

  // GET : Get products by category
  async findAllProductByCategory(id : string,query: Query): Promise<Product[]> {
    const resPerPage = Number(query.limit) || 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    
    const products = await this.productModel
      .find({ category: { $in: [id] } })
      .limit(resPerPage)
      .skip(skip);
    return products;
  }

  // POST : Create a new product
  async create(product: Product, user: User): Promise<Product> {
    const data = Object.assign(product, { user: user._id });

    const res = await this.productModel.create(data);
    return res;
  }

  
  // GET : Finds Product by ID
  async findById(id: string): Promise<Product> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }


  // PUT : Updates product by ID
  async updateById(id: string, product: Product, user : User): Promise<Product> {

    if (!user) {
      throw new UnauthorizedException('User information is missing.');
    }

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const productDB = await this.productModel.findById(id);
    if (!productDB) {
      throw new NotFoundException('Product not found.');
    }

    const userID = new Object(productDB.user).toString();
 
    if (userID != user._id)
    {
      throw new UnauthorizedException('Unauthorized User Access')
    }

    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });
  }


  // DELETE : Deletes product by ID
  async deleteById(id: string, user:User): Promise<Product> {

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const userID = new Object(product.user).toString();

    if (userID != user._id && user.role != 'Admin' )
    {
      throw new UnauthorizedException('Unauthorized User Access')
    }
    
    return await this.productModel.findByIdAndDelete(id);
  }

  
}
