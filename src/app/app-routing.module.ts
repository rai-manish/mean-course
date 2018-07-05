import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent} from './posts/post-list/post-list.component';
import { PostCreateComponent} from './posts/post-create/post-create.component';
import { LoginComponent} from './auth/login/login.component';
import { SignupComponent} from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard';

// Routes are simple javascript object where we define to which url for which part of our app should be presented
const routes: Routes = [
	{ path: '', component: PostListComponent },
	{ path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
	{ path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
];
@NgModule({
	// import RouterModule in our module
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule], // this is to export to othe module
	providers: [AuthGuard]
})

export class AppRoutingModule{

}