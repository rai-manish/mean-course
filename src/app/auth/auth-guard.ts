import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate{

	constructor(private authService: AuthService, private route: Router){}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
		const isAuth = this.authService.getIsAuth();
		if(!isAuth){
			this.route.navigate(['/login']);
		}
		return isAuth;
	}

}