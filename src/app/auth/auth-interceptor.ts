import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
// this is class to used intercept the http request to attach a header to every request in header
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

	constructor(public authService: AuthService){}
	// angular will call this method  for all the request leaving your app
	// we have to have this method if you are implementing HttpInterceptor interface
	// any is ued to specify for all tge request not particular resource
	intercept(req: HttpRequest<any>, next: HttpHandler){
		const authToken = this.authService.getToken();
		// we need to clone th request before addig a headers into it
		const authRequest = req.clone({
			headers: req.headers.set("Authorization", "Bearer " + authToken)
		});
		// passing a request to handle other things
		return next.handle(authRequest);
	}

}