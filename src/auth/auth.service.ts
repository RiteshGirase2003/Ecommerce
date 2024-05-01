import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserRoles } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    // private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {

    const { name, email, password, role } = signUpDto;
    const isEmailExist = await this.userModel.findOne({email:email});
    if (isEmailExist)
    {
      throw new ConflictException('Email Already Exists')  
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // const token = this.jwtService.sign({ id: user._id });
    const token = jwt.sign({ id: user._id, role },process.env.JWT_SECRET);


    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // const token = this.jwtService.sign({ id: user._id }, process.env.JWT_SECRET);
    const token = jwt.sign({ id: user._id, role : user.role },process.env.JWT_SECRET);

    return { token };
  }


  async findById(id : string) : Promise<User>{
    return await this.userModel.findById(id);
  }

  // DELETE : Deletes User by ID
  
  async deleteById(id: string): Promise<User> {

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return await this.userModel.findByIdAndDelete(id);
  }

}
