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
    private userId: string;
    private tokenTimer: number;
    private authStausListener = new Subject<boolean>();
    
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getToken() { return this.token; }
    getUserId() { return this.userId; }
    getIsAuth() { return this.isAuthenticated; }
    getAuthStausListener() { return this.authStausListener.asObservable(); }
    
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(
            () => this.router.navigate(['/']),
            error => this.authStausListener.next(false)
        );
    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password}; // console.log('AuthData:', authData);
        this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(
            response => {
                // console.log(response);
                this.token = response.token;
                if (this.token) {
                    const expiresInDuration = response.expiresIn; //console.log('expiresInDuration: ',expiresInDuration);
                    this.setAuthTimer(expiresInDuration * 1000);
                    // console.log('tokenTimer type: ', typeof this.tokenTimer);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStausListener.next(true);
                    const expiratinDate = new Date((new Date()).getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expiratinDate, this.userId);
                    this.router.navigate(['/']);
                };
            },
            error => {
                console.log('Login failed:', error.message);
                console.log(error);
                this.authStausListener.next(false);
            }
        );
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.userId = null;
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
        const authInfo = this.getAuthData();
        if(!authInfo) return;
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime(); //console.log('expiresIn: ', expiresIn);
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.setAuthTimer(expiresIn);
            this.isAuthenticated = true;
            this.userId = authInfo.userId;
            this.authStausListener.next(true);
            this.router.navigate(['/']);
        };
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private getAuthData() {
        const token = localStorage.getItem('token'); //console.log('token from storage: ', token);
        const expirationDate = localStorage.getItem('tokenExpiration');
        const userId = localStorage.getItem('userId');
        //console.log('tokenExpiration from storage: ', expirationDate);

        if (!token || !expirationDate) return;
        
        return { token: token, expirationDate: new Date(expirationDate), userId: userId };
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userId');
    }
}