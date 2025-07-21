"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { getUserById } from "../services/auth"
import { getPostsByUser } from "../services/feed"
import { useAuth } from "../context/AuthContext"
import Header from "../components/Header"
import PostCard from "../components/PostCard"
import "../styles/Profile.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [error, setError] = useState("")
  const { currentUser } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // If userId is provided, fetch that user's profile, otherwise show current user
        const userData = userId ? await getUserById(userId) : currentUser
        setUser(userData)

        // Fetch user's posts
        fetchUserPosts(userId || currentUser.id)
      } catch (err) {
        setError(err.message || "Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, currentUser])

  const fetchUserPosts = async (id) => {
    setPostsLoading(true)
    try {
      console.log("Fetching posts for user:", id)
      const userPosts = await getPostsByUser(id)
      console.log("User posts:", userPosts)
      setPosts(userPosts)
    } catch (err) {
      console.error("Error fetching user posts:", err)
      setError(err.message || "Failed to load user posts")
    } finally {
      setPostsLoading(false)
    }
  }

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="profile-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="body">
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-photo">
            {user.coverPicture ? (
              <img src={user.coverPicture || "/placeholder.svg"} alt="Cover" />
            ) : (
              <div className="default-cover"></div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-picture">
              {user.profilePicture ? (
                <img src={user.profilePicture || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
              ) : (
                <div className="default-profile-pic">
                  {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0)}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h1>
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Complete Your Profile"}
              </h1>
              <p className="position">{user.position || "No position set"}</p>
              <p className="location">{user.location || "No location set"}</p>
              <p className="company">{user.company || "No company set"}</p>

              {!user.emailVerified && user.id === currentUser.id && (
                <div className="verification-alert">
                  <p>
                    Your email is not verified. <Link to="/verify-email">Verify now</Link>
                  </p>
                </div>
              )}

              {!user.profileComplete && user.id === currentUser.id && (
                <div className="profile-incomplete-alert">
                  <p>
                    Your profile is incomplete. <Link to="/profile/edit">Complete now</Link>
                  </p>
                </div>
              )}

              {user.id === currentUser.id && (
                <Link to="/profile/edit" className="edit-profile-button">
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>About</h2>
            <p>{user.about || "No information provided"}</p>
          </div>

          <div className="profile-section">
            <h2>Posts</h2>
            {postsLoading ? (
              <div className="loading-posts">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <p className="no-posts-message">No posts yet. Create your first post on the feed page!</p>
            ) : (
              <div className="profile-posts">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default ProfilePage
