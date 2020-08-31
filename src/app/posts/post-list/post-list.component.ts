import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { AuthService } from '../../auth/auth.service';
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit,OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [3, 5, 10, 15, 25];
  userIsAuthenticated: boolean;
  private postsSub: Subscription;
  private authListenerSubs: Subscription;
  
  constructor(
    private authService: AuthService,
    public postsService: PostsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postsData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postsData.posts; console.log('Posts received: ', this.posts);
        this.totalPosts = postsData.postCount; // console.log('Total number of posts: ', this.totalPosts);
      });
    this.authListenerSubs = this.authService.getAuthStausListener().subscribe(isAuthenicated => {
      this.userIsAuthenticated = isAuthenicated;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
    .subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // this.isLoading = false;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
