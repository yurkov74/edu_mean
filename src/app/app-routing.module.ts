import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// app modules
// import { AuthModule } from './auth/auth.module';
// app components
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
// app Services
import { AuthGuard } from './auth/auth.guard'; 

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: 'auth', loadChildren: 'auth/auth.module#AuthModule'}, // old syntax
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '*', component: PostListComponent },
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
