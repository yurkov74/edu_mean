import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorDialogComponent } from './error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private dialog: MatDialog
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler ) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error interceptor activated:', error);
                let errMsg = 'Some error occurred!';
                if (error.message) errMsg = error.message;
                if (error.error.message) errMsg = error.error.message;
                this.dialog.open(ErrorDialogComponent, { data: {
                    message: errMsg
                }});
                return throwError(error);
            })
        );
    }
}