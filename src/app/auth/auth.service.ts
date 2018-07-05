import  { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService{
	private isAuthenticated = false;
	private token: string;
	private userId: string;
	private tokenTimer: NodeJS.Timer;
	// registering the event
	private authStatusListener = new Subject<boolean>();

	constructor(private http: HttpClient, private router: Router) {}

	createUser(email: string, password: string){
		const authData: AuthData = {email: email, password: password};
		this.http.post('http://localhost:3001/api/users/signup', authData)
		.subscribe((response) => {
			this.router.navigate(['/ ']);
		} ,error =>{
			this.authStatusListener.next(false);
		});
	}

	// so that this token should be available to other request
	getToken(){
		return this.token;
	}

	getIsAuth(){
		return this.isAuthenticated;
	}

	getUserId(){
		return this.userId;
	}

	getAuthStatusListener(){
		return this.authStatusListener.asObservable();
	}

	loginUser(email: string, password: string){
		const authData: AuthData = {email: email, password: password};
		this.http.post<{message: string, token: string, expiresIn: number, userId: string}>('http://localhost:3001/api/users/login', authData)
		.subscribe((response) => {
			const token = response.token;
			this.token = token;
			if(token){
				const expiresInDuration = response.expiresIn;

				// expiring the token

				this.setAuthTimer(expiresInDuration);
				this.isAuthenticated = true;
				//setting the userID
				this.userId = response.userId;
				// emiting the event
				this.authStatusListener.next(true);
				const now = new Date();
				const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
				this.saveAuthData(token, expirationDate, this.userId);
				this.router.navigate(['/']);
			}
			
		}, error =>{
			this.authStatusListener.next(false);
		});
	}

	// verify the token stored in local storage
	autoAuthUser(){
		let expiresIn;
		const authInformation = this.getAuthData();
		if(authInformation){
			const now  = new Date();
			expiresIn = authInformation.expirationDate.getTime() - now.getTime();
		}
		else{
			expiresIn = -1;
		}
		if(expiresIn > 0){
			this.token = authInformation.token;
			this.isAuthenticated = true;
			this.userId = authInformation.userId;
			this.authStatusListener.next(true);
			// setting the expiration time remaining
			this.setAuthTimer(expiresIn / 1000);
		}
	}

	logout(){
		this.token = null;
		this.userId = null;
		this.isAuthenticated = false;
		this.authStatusListener.next(false);
		//clear the timeout
		clearTimeout(this.tokenTimer);
		this.clearAuthData();
		this.router.navigate(['/']);
	}

	// storing in local storage
	// method is private because we want to access this method only within the class

	private setAuthTimer(duration: number){
		this.tokenTimer = setTimeout(() => {
			this.logout();
		}, duration * 1000);
	}

	private saveAuthData(token: string, expirationDate: Date, userId: string){
		localStorage.setItem('token', token);
		localStorage.setItem('expirationDate', expirationDate.toISOString());
		localStorage.setItem('userId', userId);
	}


	private clearAuthData(){
		localStorage.removeItem('token');
		localStorage.removeItem('expirationDate');
		localStorage.removeItem('userId');
	}

	private getAuthData(){
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expirationDate');
		const userId = localStorage.getItem('userId');
		if(!token || !expirationDate || !userId){
			return ;
		}
		else{
			return {token: token, expirationDate: new Date(expirationDate), userId: userId}
		}
	}

}
