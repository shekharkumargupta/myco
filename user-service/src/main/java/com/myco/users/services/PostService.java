package com.myco.users.services;

import com.myco.users.dtos.PostRequest;
import com.myco.users.entities.Post;

import java.time.LocalDateTime;
import java.util.List;

public interface PostService {

    Post createPost(PostRequest postRequest);
    Post findById(Long id);
    List<Post> getPostsByPostedBy(String postedBy);
    List<Post> getPostsByPostedFor(String postedFor);
    List<Post> getPostsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);


}
