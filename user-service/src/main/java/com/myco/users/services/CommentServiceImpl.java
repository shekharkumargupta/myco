package com.myco.users.services;

import com.myco.users.dtos.CommentRequest;
import com.myco.users.entities.Comment;
import com.myco.users.entities.Post;
import com.myco.users.repositories.CommentRepository;
import com.myco.users.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public Comment addComment(CommentRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId: " + request.getPostId()));

        Comment comment = new Comment();
        comment.setText(request.getText());
        comment.setCommentedBy(request.getCommentedBy());
        comment.setPost(post);
        comment.setCommentedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);

        // Push to all subscribers of that post
        messagingTemplate.convertAndSend("/topic/posts/" + post.getId() + "/comments", saved);

        return saved;
    }


    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId: " + postId));
        return commentRepository.findByPost(post);
    }
}
