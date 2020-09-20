import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
// app modules
import { AngularMaterialModule } from '../angular-material.module';
// app components
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ]
})
export class PostsModule {}