"use client"

import { useState } from "react"
import { addComment } from "../services/feed"

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError("")

    try {
      const newComment = await addComment(postId, content)
      onCommentAdded(newComment)
      setContent("")
    } catch (err) {
      setError(err.message || "Failed to add comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="comment-error">{error}</div>}
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  )
}

export default CommentForm
