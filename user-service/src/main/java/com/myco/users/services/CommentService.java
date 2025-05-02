package com.myco.users.services;

import com.myco.users.dtos.CommentRequest;
import com.myco.users.entities.Comment;

import java.util.List;

public interface CommentService {
    Comment addComment(CommentRequest request);
    List<Comment> getCommentsByPostId(Long postId);
}
