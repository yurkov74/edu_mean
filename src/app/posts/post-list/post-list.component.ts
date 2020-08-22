import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts: Post[];
  isLoading = false;
  private postsSub: Subscription;
  
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    console.log('Control point1: ');
    this.posts = this.postsService.getPosts();
    this.isLoading = false;
    // console.log('Control point2: '); console.log(this.posts);
    // this.postsSub = this.postsService.getPostUpdateListener()
    //   .subscribe((posts: Post[]) => {
    //     console.log('Control point8: ');
    //     this.posts = posts;
    //     this.isLoading = false;
    //     console.log('Control point10: '); console.log(this.posts);
    //   });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
