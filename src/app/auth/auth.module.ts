import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
// app modules
import { AngularMaterialModule } from '../angular-material.module';
// app components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        FormsModule,
    ]
})
export class AuthModule {}