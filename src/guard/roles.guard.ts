import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { User, UserRoles } from "src/auth/schemas/user.schema";
import { Roles } from "./roles.decorator";
import { Request } from "express";
import * as jwt from "jsonwebtoken";


@Injectable()

export class RolesGuard implements CanActivate{

    constructor(private reflector : Reflector,
        
    ){}

    canActivate(context: ExecutionContext): boolean  {
        const requiredRoles =  this.reflector.get<UserRoles[]>(Roles, context.getHandler());
        if(!requiredRoles)
        {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        
        const user = request.headers.authorization;
        const BearerToken = user.split(' ')[1];
        const data = jwt.verify(BearerToken,process.env.JWT_SECRET) as jwt.JwtPayload
        // const id = data?.id;
        const role = data?.role;

            
       
        if (!role)
        {
            throw new UnauthorizedException('User Role Is Not Defined');
        }

        // console.log(` requried : ${requiredRoles} Role: ${role}`)
        const isAuthorized = requiredRoles == role ? true : false;

        if (!isAuthorized)
            {
                throw new UnauthorizedException('Unauthorized User');
            }
        // console.log('isAuthorized', isAuthorized);
        return isAuthorized;

    }
}