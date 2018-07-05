import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from  '@angular/material';
import {ErrorComponent} from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

	constructor(private dialog: MatDialog){}

	// angular will call this method  for all the request leaving your app
	// we have to have this method if you are implementing HttpInterceptor interface
	// any is ued to specify for all tge request not particular resource
	
	intercept(req: HttpRequest<any>, next: HttpHandler){
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				let errorMessage = "An error occured";
				if(error.error.message){
					errorMessage = error.error.message;
				}
				this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
				throw throwError(error);
			})
		);
	}

}