import { NgModule } from '@angular/core';
// angular material
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
    // imports: [
    //     MatButtonModule,
    //     MatCardModule,
    //     MatDialogModule,
    //     MatInputModule,
    //     MatExpansionModule,
    //     MatPaginatorModule,
    //     MatProgressSpinnerModule,
    //     MatToolbarModule,
    // ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
    ]
})
export class AngularMaterialModule {}