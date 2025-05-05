import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from './config';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  
  const userId = '483fc400-3723-4a52-9239-64ada79d58ba';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/posts/by-user/${userId}`);
      const data = await res.json();

      const postsWithImages = await Promise.all(data.map(async (post) => {
        const imagesRes = await fetch(`${API_BASE_URL}/v1/posts/${post.id}/files`);
        const images = await imagesRes.json();
        return { ...post, images };
      }));

      setPosts(postsWithImages);
    } catch (error) {
      setError('Error fetching posts or images');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostComments = async (postId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/comments/post/${postId}`);
      const data = await res.json();
      const commentsArray = Array.isArray(data) ? data : data.comments || [];
      setPostComments((prev) => ({ ...prev, [postId]: commentsArray }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/v1/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment, commentedBy: userId, postId: postId}),
      });
      if (res.ok) {
        setNewComment('');
        fetchPostComments(postId);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleSection = (postId, section) => {
    setVisibleSections((prev) => {
      const current = prev[postId] || {};
      const updated = {
        ...current,
        [section]: !current[section],
      };

      if (section === 'comments' && !current[section] && !postComments[postId]) {
        fetchPostComments(postId);
      }

      return { ...prev, [postId]: updated };
    });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow-sm w-100">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="mb-0">myco</h1>
          <button
            className="btn btn-outline-light"
            title="Go Home"
            onClick={() => navigate('/home')}
          >
            <i className="bi bi-house-fill"></i>
          </button>
        </div>
      </header>

      {loading && <p className="text-center mt-4">Loading posts...</p>}
      {error && <p className="text-danger text-center mt-4">{error}</p>}

      <div className="container py-4">
        <div className="row">
          {posts.map((post) => (
              <div key={post.id} className="col-12 col-md-6 mb-4">
              <div className="card w-100 shadow-sm">
			  {/* Post Title Section */}
				<div className="card-body border-bottom">
					<h5 className="card-title mb-1">{post.title}</h5>
					<p className="card-text text-muted mb-2">{post.description}</p>
				</div>
                {/* Images */}
                <div className="position-relative">
                  {post.images && post.images.length > 0 ? (
                    <img
                      src={post.images[0].filePath}
                      alt="Post"
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-secondary d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                      <span className="text-white">No Image</span>
                    </div>
                  )}

                  {/* Toggle Icons */}
                  <div className="position-absolute bottom-0 start-0 mb-3 ms-3">
                    <button
                      className="btn btn-light me-2"
                      onClick={() => toggleSection(post.id, 'comments')}
                    >
                      <i className="bi bi-chat-left-dots"></i>
                    </button>
                    <button
                      className="btn btn-light"
                      onClick={() => toggleSection(post.id, 'map')}
                    >
                      <i className="bi bi-map"></i>
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  {/* Map Section */}
                  {visibleSections[post.id]?.map && post.latitude && post.longitude && (
                    <div style={{ height: '200px' }} className="mb-3">
                      <MapContainer center={[post.latitude, post.longitude]} zoom={13} style={{ height: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[post.latitude, post.longitude]}>
                          <Popup>{post.location || 'Location'}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}

                  {/* Comments Section */}
                  {visibleSections[post.id]?.comments && (
                    <div className="mb-3">
                      <h6>Comments</h6>
                      <ul className="list-unstyled">
                        {Array.isArray(postComments[post.id]) &&
                          postComments[post.id].map((comment, index) => (
                            <li key={index} className="mb-2">
                              <p><strong>{comment.commentedBy || "Anonymous"}</strong>: {comment.text}</p>
                            </li>
                          ))}
                      </ul>
                      <div>
                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => handleAddComment(post.id)}
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
