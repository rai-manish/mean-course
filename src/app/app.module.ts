import { BrowserModule } from '@angular/platform-browser';
//to import ngfrom objecr
import { NgModule } from '@angular/core';
// to import inputs
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
//to import http
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PostsService} from './posts/posts.service';
import { AuthService} from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/post.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    PostModule
  ],
  providers: [PostsService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}], 
  // this is to tell the angular to add our interceptor along with the one which angular is using
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent] // component need to be create on run
})
export class AppModule { }
