import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Post } from "./post.model";

@Injectable ({ providedIn: "root" })
export class PostsService {
    posts: Post[] = [
        { id: "0001", title: "First Post", content: "This is the first post's content" },
        { id: "0002", title: "Second Post", content: "This is the second post's content" },
        { id: "0003", title: "Third Post", content: "This is the third post's content" }
    ];
    private postsUpdated = new Subject<Post[]>();
    
    getPosts() { console.log('Control point4: ');
        // this.posts = [...this.posts];
        // this.postsUpdated.next(this.posts);
        // console.log('Control point1: '); console.log(this.postsUpdated);
        return [...this.posts];
    }

    getPostUpdateListener() {console.log('Control point2: ');
        return this.postsUpdated.asObservable();
    }

    deletePost(postId) { console.log('postsServie.deletePost function isn\'t implemented yet'); }
}