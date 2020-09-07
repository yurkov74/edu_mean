import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable ({ providedIn: "root" })
export class PostsService {
    // posts: Post[] = [
    //     { id: "0001", title: "First Post", content: "This is the first post's content" },
    //     { id: "0002", title: "Second Post", content: "This is the second post's content" },
    //     { id: "0003", title: "Third Post", content: "This is the third post's content" }
    // ];
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}
    
    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; posts: any; maxPosts: number }>("http://localhost:3000/api/posts" + queryParams)
        .pipe(
        map(postData => {
            return {
                posts: postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath,
                        creator: post.creator
                    };
                }),
                maxPosts: postData.maxPosts
            };
        })
        )
        .subscribe(transformedPostsData => { console.log('transformedPostsData: ', transformedPostsData);
            this.posts = transformedPostsData.posts;
            this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts});
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
            "http://localhost:3000/api/posts/" + id
        );
    }
    
    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http
        .post<{ message: string; post: Post }>(
            "http://localhost:3000/api/posts",
            postData
        )
        .subscribe(responseData => {
            // const post: Post = {
            //     id: responseData.post.id,
            //     title: title,
            //     content: content,
            //     imagePath: responseData.post.imagePath
            // }
            // this.posts.push(post);
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        };

        this.http
        .put("http://localhost:3000/api/posts/" + id, postData)
        .subscribe(response => {
            // const updatedPosts = [...this.posts];
            // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            // const post: Post = {
            //     id: id,
            //     title: title,
            //     content: content,
            //     imagePath: ''
            // };
            // updatedPosts[oldPostIndex] = post;
            // this.posts = updatedPosts;
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    deletePost(postId: string) {
        return this.http
        .delete("http://localhost:3000/api/posts/" + postId);
    }
}