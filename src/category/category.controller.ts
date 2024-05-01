import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/guard/roles.decorator';
import { UserRoles } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/guard/roles.guard';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Controller('category')
@ApiTags('Category')
export class CategoryController {

    constructor(private categoryService: CategoryService){}

 

    @Get()
    @ApiOperation({summary: "Get All Categories", description: "Get all Categories"})
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    async getAllCategory(@Query() query: ExpressQuery): Promise<Category[]>{
        return this.categoryService.getAllCategory(query);
    }



    @Get(':id')
    async getProduct(
        @Param('id')
        id: string,
    ): Promise<Category> {
        return this.categoryService.findById(id);
    }

    @Post()
    @Roles([UserRoles.ADMIN])
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard())
    async createCategory( @Body() category: CreateCategoryDto, @Req() req): Promise<Category>{
        return this.categoryService.create(category,req.user);
    }  


    @Put(':id')
    @Roles([UserRoles.ADMIN])
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard())
    async updateProduct(
      @Param('id')
      id: string,
      @Body()
      category: UpdateCategoryDto,
      @Req() req,
    ): Promise<Category> {
      return this.categoryService.updateById(id, category,req.user);
    }

    @Delete(':id')
    @Roles([UserRoles.ADMIN])
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard())
    async deleteProduct(
      @Param('id')
      id: string,
      
    ): Promise<Category> {
      return this.categoryService.deleteById(id);
    }

}
