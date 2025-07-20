import api from "./api"

// Get feed posts
export const getFeedPosts = async () => {
  try {
    const response = await api.get("/api/v1/feed")
    return response.data
  } catch (error) {
    console.error("Error fetching feed posts:", error)
    throw error.response?.data || { message: error.message }
  }
}

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await api.get("/api/v1/feed/posts")
    return response.data
  } catch (error) {
    console.error("Error fetching all posts:", error)
    throw error.response?.data || { message: error.message }
  }
}

// Get posts by user ID
export const getPostsByUser = async (userId) => {
  try {
    const response = await api.get(`/api/v1/feed/posts/user/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Create post with single image (backward compatibility)
export const createPost = async (content, picture = null) => {
  try {
    console.log("Creating post with:", { content, picture })

    // If picture is an array, use it as mediaUrls
    if (Array.isArray(picture)) {
      return createPostWithMedia(content, picture)
    }

    const response = await api.post("/api/v1/feed/posts", {
      content,
      picture,
    })
    console.log("Post created successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Post creation error:", error)
    throw error.response?.data || { message: error.message || "Failed to create post" }
  }
}

// Create post with multiple media files
export const createPostWithMedia = async (content, mediaUrls = []) => {
  try {
    console.log("Creating post with media:", { content, mediaUrls })
    const response = await api.post("/api/v1/feed/posts", {
      content,
      mediaUrls,
    })
    console.log("Post created successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Post creation error:", error)
    throw error.response?.data || { message: error.message || "Failed to create post" }
  }
}

// Edit post
export const editPost = async (postId, content, mediaUrls = []) => {
  try {
    // If mediaUrls is a string, convert it to an array for backward compatibility
    const mediaArray = typeof mediaUrls === "string" ? [mediaUrls] : mediaUrls

    const response = await api.put(`/api/v1/feed/posts/${postId}`, {
      content,
      mediaUrls: mediaArray,
    })
    return response.data
  } catch (error) {
    console.error(`Error editing post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/v1/feed/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Like post
export const likePost = async (postId) => {
  try {
    console.log(`Liking post ${postId}...`)
    const response = await api.put(`/api/v1/feed/posts/${postId}/like`)
    console.log(`Like response for post ${postId}:`, response.data)
    return response.data
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Get post likes
export const getPostLikes = async (postId) => {
  try {
    const response = await api.get(`/api/v1/feed/posts/${postId}/likes`)
    return response.data
  } catch (error) {
    console.error(`Error getting likes for post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Add comment
export const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/api/v1/feed/posts/${postId}/comments`, { content })
    return response.data
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Get post comments
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/api/v1/feed/posts/${postId}/comments`)
    return response.data
  } catch (error) {
    console.error(`Error getting comments for post ${postId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Edit comment
export const editComment = async (commentId, content) => {
  try {
    const response = await api.put(`/api/v1/feed/comments/${commentId}`, { content })
    return response.data
  } catch (error) {
    console.error(`Error editing comment ${commentId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/v1/feed/comments/${commentId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    throw error.response?.data || { message: error.message }
  }
}
