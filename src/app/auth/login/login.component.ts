import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    isLoading = false;

    constructor(
        private authService: AuthService
    ) {}

    onLogin(form: NgForm) {
        // console.log('login form: ', form.value);
        if (form.invalid) return;
        this.isLoading =true;
        this.authService.login(form.value.email, form.value.password);
    }
}