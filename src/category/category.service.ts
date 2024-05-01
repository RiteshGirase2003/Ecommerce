import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Query } from 'express-serve-static-core';


@Injectable()
export class CategoryService {

    constructor(
        @InjectModel(Category.name)
        private categoryModel: mongoose.Model<Category>,
    ){}

    // POST : Create New Category
    async create (category: Category, user : User) : Promise<Category>{
        const data = Object.assign(category, {user : user._id});

        const res = await this.categoryModel.create(data);
        return res;
    }


    // GET : Find All Categories
    async getAllCategory(query : Query) : Promise<Category[]> {
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

        const categories = await this.categoryModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip);
        return categories;

    
    }


    
    // GET : Finds Category by ID
    async findById(id: string): Promise<Category> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
        throw new BadRequestException('Please enter correct id.');
        }

        const category = await this.categoryModel.findById(id);

        if (!category) {
        throw new NotFoundException('Category not found.');
        }

        return category;
    }


    // PUT : Updates Category by ID
  async updateById(id: string, category : Category, user : User): Promise<Category> {

    if (!user) {
      throw new UnauthorizedException('User information is missing.');
    }

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const categoryDB = await this.categoryModel.findById(id);
    if (!categoryDB) {
      throw new NotFoundException('Product not found.');
    }

    const userID = new Object(categoryDB.user).toString();
 
    if (userID != user._id)
    {
      throw new UnauthorizedException('Unauthorized User Access')
    }

    return await this.categoryModel.findByIdAndUpdate(id, category, {
      new: true,
      runValidators: true,
    });
  }


  // DELETE : Deletes Category by ID
  async deleteById(id: string): Promise<Category> {

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return await this.categoryModel.findByIdAndDelete(id);
  }

}
