import { Component, OnInit } from '@angular/core';
import { NgForm, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms'
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

// import { Post } from '../post/post.model';

@Component({
	selector: 'app-create-component',
	templateUrl: './post-create.component.html',
	styleUrls: ['post-create.component.css']
})

export class PostCreateComponent implements OnInit {
	title = "";
	content = "";
	post: Post;
	isLoading = false;
	form: FormGroup;
	imagePreview: string;
	private mode = 'create';
	private postId: string;

	// ActivedRoute will give us information anout from which route component is called

	constructor(public postsService: PostsService, public route: ActivatedRoute) {

	}

	// to emit the event to its parents
		// @Output() postCreated = new EventEmitter<Post>();

	onSavePost(){
		if(this.form.invalid){
			return;
		}
		this.isLoading = true;
		if(this.mode == 'create'){
			this.postsService.addPost(this.form.value.title, this.form.value.content);
		}else{
			this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
		}

		//to reset the this.form
		this.form.reset();
	}

	ngOnInit(){

		this.form = new FormGroup({
			'title': new FormControl(null, {
					validators: [Validators.required, Validators.minLength(3)]
			}), 
			'content': new FormControl(null,{
				validators: [Validators.required]
			}),
			// 'image': new FormControl(null, {
			// 	validators: []
			// })
		});

		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			if(paramMap.has('postId')){
				this.mode = 'edit';
				this.postId = paramMap.get('postId');
				// start loading the spinner
				this.isLoading = true;
				this.postsService.getPost(this.postId).subscribe(post => {
					// stop loading the spinner
					this.isLoading = false;
					this.post = {id: post._id, title: post.title, content: post.content, creator: post.creator};
					// we are initializing the fom control, required in case of edit the form
					this.form.setValue({title: this.post.title, content: this.post.content});
				});
			}else{
				this.mode = 'create';
				this.postId = null;
				// this.post = {title: "", content: ""};
			}
		});
	}

	onImagePicked(event){
		// event.target is converted to html inout element explicitly so as to tell typescript that is of input type element so that we could access files method on it otherwise won't
		const file = (event.target as HTMLInputElement).files[0];
		// this method allows us to target the particular input element form form group and assign a value to it
		this.form.patchValue({image: file});
		// this is to tell the typescript to valiate the input again 
		this.form.get('image').updateValueAndValidity();

		const reader = new FileReader();

		reader.onload = () => {
			this.imagePreview = reader.result;
		}
		reader.readAsDataURL(file);

	}
}