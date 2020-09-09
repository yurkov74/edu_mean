import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusListener: Subscription;

    constructor(
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authStatusListener = this.authService.getAuthStausListener()
        .subscribe(() => this.isLoading = false);
    }

    onSignUp(form: NgForm) {
        // console.log('Signup form: ', form.value);
        if (form.invalid) return;
        this.isLoading =true;
        this.authService.createUser(form.value.email, form.value.password);
    }

    ngOnDestroy() { this.authStatusListener.unsubscribe(); }
}