"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { editComment, deleteComment } from "../services/feed"
import { useAuth } from "../context/AuthContext"

const CommentList = ({ comments, onCommentUpdated, onCommentDeleted }) => {
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const { currentUser } = useAuth()

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  const handleSaveEdit = async (commentId) => {
    try {
      const updatedComment = await editComment(commentId, editContent)
      onCommentUpdated(updatedComment)
      setEditingCommentId(null)
      setEditContent("")
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId)
        onCommentDeleted(commentId)
      } catch (error) {
        console.error("Error deleting comment:", error)
      }
    }
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  if (comments.length === 0) {
    return <div className="no-comments">No comments yet. Be the first to comment!</div>
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-author">
            <Link to={`/profile/${comment.author.id}`}>
              {comment.author.profilePicture ? (
                <img
                  src={comment.author.profilePicture || "/placeholder.svg"}
                  alt={comment.author.firstName}
                  className="comment-avatar"
                />
              ) : (
                <div className="default-avatar comment-avatar">
                  {comment.author.firstName ? comment.author.firstName.charAt(0) : comment.author.email.charAt(0)}
                </div>
              )}
            </Link>
            <div className="comment-author-info">
              <Link to={`/profile/${comment.author.id}`} className="comment-author-name">
                {comment.author.firstName && comment.author.lastName
                  ? `${comment.author.firstName} ${comment.author.lastName}`
                  : comment.author.email}
              </Link>
              <span className="comment-time">{formatDate(comment.creationDate)}</span>
            </div>
          </div>

          {editingCommentId === comment.id ? (
            <div className="edit-comment-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-comment-textarea"
              ></textarea>
              <div className="edit-comment-actions">
                <button onClick={() => handleSaveEdit(comment.id)} className="save-edit-button">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="cancel-edit-button">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="comment-content">{comment.content}</div>
              {currentUser.id === comment.author.id && (
                <div className="comment-actions">
                  <button onClick={() => handleEditClick(comment)} className="edit-comment-button">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment-button">
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default CommentList
