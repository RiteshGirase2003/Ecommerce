  import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto/login.dto';
  import { SignUpDto } from './dto/signup.dto';
  import { User, UserRoles } from './schemas/user.schema';
  import { Roles } from 'src/guard/roles.decorator';
  import { RolesGuard } from 'src/guard/roles.guard';
  import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';


  @Controller('auth')
  @ApiTags('User Authentication') 
  export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
      return this.authService.signUp(signUpDto);
    }

    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
      return this.authService.login(loginDto);
    }

    @Delete(':id')
    @Roles([UserRoles.ADMIN]) 
    @UseGuards(RolesGuard) 
  
    deleteUser(@Param('id') id: string): Promise<User> {
      return this.authService.deleteById(id);
    }
  }
