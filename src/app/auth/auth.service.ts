import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, TimeoutError } from 'rxjs';

import { AuthData } from './auth-data.model';
import { timestamp } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: number;
    private authStausListener = new Subject<boolean>();
    
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getToken() { return this.token; }
    getIsAuth() { return this.isAuthenticated; }
    getAuthStausListener() { return this.authStausListener.asObservable(); }
    
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
            console.log(response);
        });
    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response => {
            // console.log(response);
            this.token = response.token;
            if (this.token) {
                const expiresInDuration = response.expiresIn; //console.log('expiresInDuration: ',expiresInDuration);
                this.setAuthTimer(expiresInDuration * 1000);
                // console.log('tokenTimer type: ', typeof this.tokenTimer);
                this.isAuthenticated = true;
                this.authStausListener.next(true);
                const expiratinDate = new Date((new Date()).getTime() + expiresInDuration * 1000);
                this.saveAuthData(this.token, expiratinDate);
                this.router.navigate(['/']);
            };
        });
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStausListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => { this.logout();}, duration);
        console.log('Authorization expires in: ', duration/1000, ' seconds...');
    };
    
    autoAuthUser(){
        const authData = this.getAuthData();
        if(!authData) return;
        const now = new Date();
        const expiresIn = authData.expirationDate.getTime() - now.getTime(); //console.log('expiresIn: ', expiresIn);
        if (expiresIn > 0) {
            this.token = authData.token;
            this.setAuthTimer(expiresIn);
            this.isAuthenticated = true;
            this.authStausListener.next(true);
            this.router.navigate(['/']);
        };
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }

    private getAuthData() {
        const token = localStorage.getItem('token'); //console.log('token from storage: ', token);
        const expirationDate = localStorage.getItem('tokenExpiration');
        //console.log('tokenExpiration from storage: ', expirationDate);

        if (!token || !expirationDate) return;
        
        return { token: token, expirationDate: new Date(expirationDate) };
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
    }
}