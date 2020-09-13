import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// app modules
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
// app services
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
// app components
import { AppComponent } from './app.component';
import { ErrorDialogComponent } from './error-dialog.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { SignupComponent } from './auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogComponent,
    HeaderComponent,
    LoginComponent,
    PostCreateComponent,
    PostListComponent,
    SignupComponent
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]
})
export class AppModule { }
