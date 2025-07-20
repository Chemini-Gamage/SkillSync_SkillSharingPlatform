"use client"

import { useState, useRef } from "react"
import { createPostWithMedia } from "../services/feed"
import { uploadMedia, compressImage, checkVideoDuration, validateFileType } from "../services/upload"
import { useAuth } from "../context/AuthContext"

const CreatePostCard = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaPreviews, setMediaPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const { currentUser } = useAuth()

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    // Check if adding these files would exceed the limit of 3
    if (mediaFiles.length + files.length > 3) {
      setError("You can only upload up to 3 files per post")
      return
    }

    // Process each file
    for (const file of files) {
      try {
        // Check file size - limit to 50MB for videos, 5MB for images
        const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024
        if (file.size > maxSize) {
          const fileType = file.type.startsWith("video/") ? "Video" : "Image"
          const maxSizeMB = maxSize / (1024 * 1024)
          setError(`${fileType} size must be less than ${maxSizeMB}MB`)
          continue
        }

        // Validate file type
        let fileType
        try {
          fileType = validateFileType(file)
        } catch (err) {
          setError(err.message)
          continue
        }

        // For videos, check duration
        if (fileType === "video") {
          try {
            await checkVideoDuration(file)
          } catch (err) {
            setError(err.message)
            continue
          }
        }

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaPreviews((prev) => [
            ...prev,
            {
              url: reader.result,
              type: fileType,
              name: file.name,
            },
          ])
        }
        reader.readAsDataURL(file)

        // Process file (compress if it's an image)
        const processedFile = fileType === "image" ? await compressImage(file) : file

        // Add to media files
        setMediaFiles((prev) => [...prev, processedFile])
      } catch (err) {
        console.error("Error processing file:", err)
        setError(err.message || "Failed to process file. Please try another one.")
      }
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && mediaFiles.length === 0) return

    setLoading(true)
    setError("")
    setUploadProgress(0)

    try {
      // Upload all media files
      const mediaUrls = []

      if (mediaFiles.length > 0) {
        const totalFiles = mediaFiles.length

        for (let i = 0; i < mediaFiles.length; i++) {
          // Update progress based on file index
          setUploadProgress(Math.round((i / totalFiles) * 90))

          try {
            const url = await uploadMedia(mediaFiles[i])
            mediaUrls.push(url)
          } catch (err) {
            console.error("Error uploading media:", err)
            setError(`Failed to upload ${mediaFiles[i].name}. Please try again.`)
            setLoading(false)
            return
          }
        }

        setUploadProgress(100)
      }

      // Create the post with the media URLs
      const newPost = await createPostWithMedia(content, mediaUrls)
      onPostCreated(newPost)

      // Reset form
      setContent("")
      setMediaFiles([])
      setMediaPreviews([])
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Post creation error:", err)
      setError(err.message || "Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-card">
      <form onSubmit={handleSubmit}>
        {error && <div className="post-error">{error}</div>}
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        ></textarea>

        {mediaPreviews.length > 0 && (
          <div className="media-previews">
            {mediaPreviews.map((media, index) => (
              <div key={index} className="media-preview-item">
                {media.type === "image" ? (
                  <img src={media.url || "/placeholder.svg"} alt={`Preview ${index}`} />
                ) : (
                  <video src={media.url} controls />
                )}
                <button type="button" className="remove-media-button" onClick={() => removeMedia(index)}>
                  ×
                </button>
              </div>
            ))}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-container">
                <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                <span className="upload-progress-text">{uploadProgress}%</span>
              </div>
            )}
          </div>
        )}

        <div className="post-actions">
          <div className="media-upload-buttons">
            <label className="media-upload-button">
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Photo
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleMediaUpload}
                disabled={loading || mediaFiles.length >= 3}
                ref={fileInputRef}
                multiple
              />
            </label>

            <label className="media-upload-button">
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
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Video
              <input
                type="file"
                accept="video/mp4, video/webm, video/quicktime"
                onChange={handleMediaUpload}
                disabled={loading || mediaFiles.length >= 3}
                multiple
              />
            </label>
          </div>

          <div className="media-count">{mediaFiles.length > 0 && <span>{mediaFiles.length}/3 files</span>}</div>

          <button
            type="submit"
            className="post-button"
            disabled={loading || (!content.trim() && mediaFiles.length === 0)}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostCard
