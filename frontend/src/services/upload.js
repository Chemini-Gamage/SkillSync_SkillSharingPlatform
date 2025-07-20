// Function to upload an image/video and get a URL back
export const uploadMedia = async (file) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", file)

    // Make a multipart/form-data request
    const response = await fetch("http://localhost:8089/api/v1/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload media")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Media upload error:", error)
    throw error
  }
}

// Function to convert a file to base64 (fallback if server upload fails)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// Function to compress an image before upload
export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result

      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas")

        // Calculate new dimensions (max 800px width/height)
        let width = img.width
        let height = img.height
        const maxSize = 800

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw the resized image
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob with reduced quality
        canvas.toBlob(
          (blob) => {
            // Create a new file from the blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          "image/jpeg",
          0.7,
        )
      }
    }
  })
}

// Function to check video duration
export const checkVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    // Create a video element to check duration
    const video = document.createElement("video")
    video.preload = "metadata"

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const duration = video.duration

      if (duration > 30) {
        reject(new Error("Video must be 30 seconds or less"))
      } else {
        resolve(file)
      }
    }

    video.onerror = () => {
      reject(new Error("Could not load video metadata"))
    }

    video.src = URL.createObjectURL(file)
  })
}

// Function to validate file type
export const validateFileType = (file) => {
  const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"]

  if (validImageTypes.includes(file.type)) {
    return "image"
  } else if (validVideoTypes.includes(file.type)) {
    return "video"
  } else {
    throw new Error("Unsupported file type. Please upload images (JPEG, PNG, GIF) or videos (MP4, WebM, QuickTime)")
  }
}
