import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ){
        super();
    }
    
    async canActivate(context: ExecutionContext){
        const canActivate = await super.canActivate(context);
        if(!canActivate){
            return false;
        }

        const requiredRoles= this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY, 
            [context.getHandler(), context.getClass()]
        );

        if(!requiredRoles){
            return true;
        }
         

        const request= context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if(!token){
            throw new UnauthorizedException('SEM AUTORIZACAO');
        }

        const payload = this.jwtService.verify(token);

        const userRoles = payload.role || [];
        const hasRole = () => userRoles.some(role => requiredRoles.includes(role));

        if(!hasRole){
            throw new UnauthorizedException("Acesso nao autorizado")
        }
        return true;
    }
    
}