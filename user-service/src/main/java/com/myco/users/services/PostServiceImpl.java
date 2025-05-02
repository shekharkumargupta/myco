package com.myco.users.services;

import com.myco.users.dtos.PostRequest;
import com.myco.users.entities.Post;
import com.myco.users.exceptions.FileCouldNotUploadException;
import com.myco.users.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    @Qualifier("fileUploadService")
    private FileUploadService fileUploadService;

    @Override
    public Post createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setPostedBy(postRequest.getPostedBy());
        post.setPostedFor(postRequest.getPostedFor());
        Post saved = postRepository.save(post);

        try {
            fileUploadService.uploadFile(postRequest.getFile(), post.getPostedBy(), saved.getId());

        } catch (IOException e) {
            throw new FileCouldNotUploadException("Could not upload file!");
        }
        return saved;
    }

    @Override
    public List<Post> getPostsByPostedBy(String postedBy) {
        return postRepository.findByPostedBy(postedBy);
    }

    @Override
    public List<Post> getPostsByPostedFor(String postedFor) {
        return postRepository.findByPostedFor(postedFor);
    }

    @Override
    public List<Post> getPostsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return postRepository.findByCreatedAtBetween(startDate, endDate);
    }

}
