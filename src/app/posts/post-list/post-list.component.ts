import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription} from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
	selector: 'post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

	// this is for dummy data
	// posts = [{title: 'first post', content: 'first post'},
	// 					{title: 'second post', content: 'second post'}
	// 				]

	posts: Post[] = [];
	isLoading = false;
	totalPosts = 0;
	postPerPage = 2;
	currentPage = 1;
	pageSizeOptions = [1,2,5,10];
	userIsAuthenticated = false;
	userId: string;
	private postsSub: Subscription;
	private authSub: Subscription;
	// posts: Post[] = [];

	// including post service
	//when we write public, angular will automatically create a property with same name, here postservice
	constructor(public postsService: PostsService, private authService: AuthService){
	}

	ngOnInit(){
		this.isLoading = true;
		this.userId = this.authService.getUserId();
		this.postsService.getPosts(this.postPerPage, this.currentPage);
		// listening to the post observable
		this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
			this.isLoading = false;
			console.log("postCount "+ postData.postCount);
			this.totalPosts = postData.postCount;	
			this.posts = postData.posts;
		});
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.authSub = this.authService.getAuthStatusListener().subscribe(isUserAuthenticated =>{
			this.userIsAuthenticated = isUserAuthenticated;
			this.userId = this.authService.getUserId();
		});
		// this.posts = this.postsService.getPosts();
	}

	onDelete(postId: String){
		this.isLoading = true;
		this.postsService.deletePost(postId).subscribe(() => {
			this.postsService.getPosts(this.postPerPage, this.currentPage);
			this.isLoading = false;
		});
	}

	ngOnDestroy(){
		this.postsSub.unsubscribe();
		this.authSub.unsubscribe();
	}

	onPageChange(pageData: PageEvent){
		console.log(pageData);
		this.currentPage = pageData.pageIndex + 1;
		this.postPerPage = pageData.pageSize;
		this.postsService.getPosts(this.postPerPage, this.currentPage);
	}
}