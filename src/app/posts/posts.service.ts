import  { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// this is to redirect to different routes
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

// @Injectable(providedIn: 'root') this provides the service at root level, create only one instance wherever you inject it
// other alternative to include service at root level to define in providers in app module
@Injectable()
export class PostsService{
 	
 	private posts: Post[] = [];
 	private postUpdated = new Subject<{posts: Post[], postCount: number}>();

 	// injecting the http client
 	constructor(private http: HttpClient, private router: Router) {}
 	
 	getPosts(pagePerPage: number, currentPage: number){
     // `` it is backstick, it is ued to add dynamic value to string
     const queryParams = `?pageSize=${pagePerPage}&page=${currentPage}`;

     // pipe is basically used to preprocess the data you are recving from api
     // you can have multiple pipe
     // here we are doing preprocessing because in interface we have define id but in mongodb it is _id so we are just converting _id to id
 		this.http
      .get<{ message: string; posts: any, maxPost: number }>(
        "http://localhost:3001/api/posts"+queryParams
      ).pipe(map((postData) => {
        return {
          maxPost: postData.maxPost,
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id, 
              creator: post.creator
            };
          })
        };
      }))
      .subscribe(transformedPost => {
        this.posts = transformedPost.posts;
        this.postUpdated.next({posts: [...this.posts], postCount: transformedPost.maxPost});
      });
 		// this is because array is reference type , so we are just sending copy of it not the actual post array
 		// return [...this.posts];

 		// if we have could have liked as below , then we could have avoided listener implementation
 			//return this.posts;
 	}

 	getPostUpdateListener(){
 		//since subject is private , so other component can not listed
 		// so we are returning listener
 		return this.postUpdated.asObservable();
 	}

   getPost(id: string){
     return this.http.get<{_id: string, title: string, content: string, creator: string}>("http://localhost:3001/api/posts/" + id);
     // return {...this.posts.find(p => p.id === id )};
   }

 	addPost(title: string, content: string){
 		const post: Post = {id: null, title: title, content: content, creator: null};

 		this.http.post<{message: string, id: string}>("http://localhost:3001/api/posts", post)
	 		.subscribe(responseData => {
	 			// console.log(responseData.message);
     //    post.id = responseData.id;
	 			// this.posts.push(post);
 				// this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
	 		});
 	}

  deletePost(postId: String){
    return this.http.delete<{message: string}>("http://localhost:3001/api/posts/" + postId);
      // .subscribe((result) => {
      //   const postUpdated = this.posts.filter(post => post.id !== postId);
      //   this.posts = postUpdated;
      //   this.postUpdated.next([...this.posts]);
      // });
  }


  updatePost(postId: string, title: string, content: string){
    const post: Post = {id: postId, title: title, content: content, creator: null };
    this.http.put<{message: string}>("http://localhost:3001/api/posts/" + postId, post)
      .subscribe((result) => {
        // const updatedPost = [...this.posts];
        // const oldPostIndex = updatedPost.findIndex(p => p.id == postId);
        // updatedPost[oldPostIndex] = post;
        // this.posts = updatedPost;
        // this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

}