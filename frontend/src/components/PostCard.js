"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { likePost, deletePost, getPostComments, editPost } from "../services/feed"
import { useAuth } from "../context/AuthContext"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [likeLoading, setLikeLoading] = useState(false)
  const { currentUser } = useAuth()

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  // Media state
  const [mediaUrls, setMediaUrls] = useState([])

  useEffect(() => {
    // Initialize likes count and check if user has liked the post
    if (post && post.likes) {
      setLikesCount(post.likes.length)

      // Check if current user has liked the post
      const userHasLiked = Array.isArray(post.likes) && post.likes.some((like) => like && like.id === currentUser.id)
      setIsLiked(userHasLiked)
    } else {
      setLikesCount(0)
      setIsLiked(false)
    }

    // Initialize edit content with post content
    if (post) {
      setEditContent(post.content)

      // Process media URLs
      const urls = []

      // Add mediaUrls if available
      if (post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
        urls.push(...post.mediaUrls)
      }
      // For backward compatibility, add picture if available and not already in mediaUrls
      else if (post.picture && !urls.includes(post.picture)) {
        urls.push(post.picture)
      }

      setMediaUrls(urls)
    }
  }, [post, currentUser.id])

  const handleLike = async () => {
    if (likeLoading) return

    setLikeLoading(true)
    setError("")

    try {
      console.log(`Liking post ${post.id}...`)
      const updatedPost = await likePost(post.id)
      console.log("Updated post after like:", updatedPost)

      // Update the post in the parent component
      if (updatedPost) {
        onPostUpdated(updatedPost)

        // Update local state
        if (updatedPost.likes) {
          const userHasLiked =
            Array.isArray(updatedPost.likes) && updatedPost.likes.some((like) => like && like.id === currentUser.id)
          setIsLiked(userHasLiked)
          setLikesCount(updatedPost.likes.length)
        }
      }
    } catch (err) {
      console.error("Error liking post:", err)
      setError("Failed to like post. Please try again.")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id)
        onPostDeleted(post.id)
      } catch (err) {
        console.error("Error deleting post:", err)
        setError("Failed to delete post. Please try again.")
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(post.content)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(post.content)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return

    setEditLoading(true)
    setError("")

    try {
      const updatedPost = await editPost(post.id, editContent, mediaUrls)
      onPostUpdated(updatedPost)
      setIsEditing(false)
    } catch (err) {
      console.error("Error editing post:", err)
      setError("Failed to edit post. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  const toggleComments = async () => {
    if (!showComments) {
      setLoading(true)
      try {
        const commentsData = await getPostComments(post.id)
        setComments(commentsData)
        setShowComments(true)
      } catch (err) {
        setError(err.message || "Failed to load comments")
      } finally {
        setLoading(false)
      }
    } else {
      setShowComments(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment])
  }

  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)))
  }

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId))
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  // Helper function to determine if a URL is a video
  const isVideoUrl = (url) => {
    if (!url) return false
    return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov") || url.includes("video")
  }

  if (!post) {
    return null
  }

  return (
    <div className="post-card">
      {error && <div className="post-error">{error}</div>}
      <div className="post-header">
        <div className="post-author">
          <Link to={`/profile/${post.author.id}`}>
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture || "/placeholder.svg"}
                alt={post.author.firstName}
                className="author-avatar"
              />
            ) : (
              <div className="default-avatar author-avatar">
                {post.author.firstName ? post.author.firstName.charAt(0) : post.author.email.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/profile/${post.author.id}`} className="author-name">
              {post.author.firstName && post.author.lastName
                ? `${post.author.firstName} ${post.author.lastName}`
                : post.author.email}
            </Link>
            <p className="author-headline">{post.author.position || "LinkedIn Member"}</p>
            <span className="post-time">{formatDate(post.creationDate)}</span>
          </div>
        </div>
        {currentUser.id === post.author.id && (
          <div className="post-actions-buttons">
            <button onClick={handleEdit} className="edit-post-button">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-post-button">
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-post-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-post-textarea"
          ></textarea>
          <div className="edit-post-actions">
            <button onClick={handleSaveEdit} className="save-edit-button" disabled={editLoading}>
              {editLoading ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit} className="cancel-edit-button" disabled={editLoading}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="post-content">
          <p>{post.content}</p>

          {mediaUrls && mediaUrls.length > 0 && (
            <div className={`post-media ${mediaUrls.length > 1 ? "post-media-grid" : ""}`}>
              {mediaUrls.map((url, index) => (
                <div key={index} className="post-media-item">
                  {isVideoUrl(url) ? (
                    <video src={url} controls className="post-video" preload="metadata" />
                  ) : (
                    <img src={url || "/placeholder.svg"} alt={`Post attachment ${index + 1}`} className="post-image" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="post-stats">
        <span className="likes-count">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </span>
        <span className="comments-count">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={`like-button ${isLiked ? "liked" : ""}`} disabled={likeLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          {likeLoading ? "Liking..." : "Like"}
        </button>
        <button onClick={toggleComments} className="comment-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {loading ? (
            <div className="loading-comments">Loading comments...</div>
          ) : error ? (
            <div className="comments-error">{error}</div>
          ) : (
            <>
              <CommentList
                comments={comments}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
              <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PostCard
