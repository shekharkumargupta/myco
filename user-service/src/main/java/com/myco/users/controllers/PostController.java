package com.myco.users.controllers;

import com.myco.users.dtos.PostRequest;
import com.myco.users.entities.Post;
import com.myco.users.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequest postRequest) {
        Post createdPost = postService.createPost(postRequest);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/by-user/{postedBy}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String postedBy) {
        List<Post> posts = postService.getPostsByPostedBy(postedBy);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/for-user/{postedFor}")
    public ResponseEntity<List<Post>> getPostsForUser(@PathVariable String postedFor) {
        List<Post> posts = postService.getPostsByPostedFor(postedFor);
        return ResponseEntity.ok(posts);
    }
}
