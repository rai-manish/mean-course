import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{

	private authListenerSubs: Subscription;
	userIsAuthenticated = false;
	constructor(private authService: AuthService){}

	ngOnInit(){
		// set the detail value as soon as page get loaded
		this.userIsAuthenticated = this.authService.getIsAuth();

		// subscribing for the future chnage in token, it might take some time to execute
		this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) =>{
			this.userIsAuthenticated = isAuthenticated;
			console.log("jshjhs "+ this.userIsAuthenticated);
		});
	}

	ngOnDestroy(){
		this.authListenerSubs.unsubscribe();
	}

	onLogout(){
		this.authService.logout();
	}
}