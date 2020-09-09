import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusListener: Subscription;

    constructor(
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authStatusListener = this.authService.getAuthStausListener()
        .subscribe(() => this.isLoading = false);
    }

    onLogin(form: NgForm) {
        // console.log('login form: ', form.value);
        if (form.invalid) return;
        this.isLoading =true;
        this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy() { this.authStatusListener.unsubscribe(); }
}