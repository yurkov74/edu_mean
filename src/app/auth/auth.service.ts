import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private authStausListener = new Subject<boolean>();
    
    constructor(
        private http: HttpClient
    ) {}

    getToken() { return this.token; }

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
        this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response => {
            // console.log(response);
            this.token = response.token;
            this.authStausListener.next(true);
        });
    }
}