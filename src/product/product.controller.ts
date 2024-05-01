import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Product') 

export class ProductController{
  constructor(private productService: ProductService) {}

  // @Get()
  // async getAllProducts(@Query() query: ExpressQuery): Promise<Product[]> {
  //   return this.productService.findAll(query);
  // }

  @Get()
  @ApiOperation({summary: "Get All Products", description: "Get all products"})
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getProducts(@Query() query: ExpressQuery): Promise<Product[]> {
    return this.productService.findAll(query);
  }

  @Get('/category/:id')
  @ApiOperation({summary: "Get Products By Category ", description: "Get products categorized by their respective categories."})
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getProductsByCategory(@Param('id') id : string, @Query() query: ExpressQuery): Promise<Product[]> {
    return this.productService.findAllProductByCategory(id,query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createProduct(
    @Body()
    product: CreateProductDto,
    @Req() req,
  ): Promise<Product> {
    return this.productService.create(product, req.user);
  }

  @Get(':id')
  async getProduct(
    @Param('id')
    id: string,
  ): Promise<Product> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateProduct(
    @Param('id')
    id: string,
    @Body()
    product: UpdateProductDto,
    @Req() req,
  ): Promise<Product> {
    return this.productService.updateById(id, product,req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteProduct(
    @Param('id')
    id: string,
    @Req() req,
  ): Promise<Product> {
    return this.productService.deleteById(id,req.user);
  }
}
