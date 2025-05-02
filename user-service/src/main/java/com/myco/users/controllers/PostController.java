package com.myco.users.controllers;

import com.myco.users.dtos.PostRequest;
import com.myco.users.entities.Post;
import com.myco.users.services.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestParam("file") MultipartFile file,
                                           @RequestParam("title") String title,
                                           @RequestParam("postedBy") String postedBy,
                                           @RequestParam("postedFor") String postedFor) {
        PostRequest postRequest = new PostRequest();
        postRequest.setFile(file);
        postRequest.setTitle(title);
        postRequest.setPostedBy(postedBy);
        postRequest.setPostedFor(postedFor);
        Post createdPost = postService.createPost(postRequest);
        String name = postRequest.getFile().getName();
        log.info("FileName: {}", name);
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
