import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
// import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable ({ providedIn: "root" })
export class PostsService {
    // posts: Post[] = [
    //     { id: "0001", title: "First Post", content: "This is the first post's content" },
    //     { id: "0002", title: "Second Post", content: "This is the second post's content" },
    //     { id: "0003", title: "Third Post", content: "This is the third post's content" }
    // ];
    posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}
    
    getPosts() {
        this.http
        .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
        .pipe(
        map(postData => {
            return postData.posts.map(post => {
            return {
                title: post.title,
                content: post.content,
                id: post._id
            };
            });
        })
        )
        .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    deletePost(postId) { console.log('postsServie.deletePost function isn\'t implemented yet'); }
}