import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent implements OnInit{
    message = 'An unkown error occured';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() { if (this.data && this.data.message) this.message = this.data.message; }
}