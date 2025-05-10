import "../styles/Auth.css"

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src="/logo1.png" alt="SkillSync Logo" className="auth-logo" />
        <div className="loading-spinner"></div>
        <h1>SkillSync</h1>
        <p>Share your skills with the world</p>
      </div>
    </div>
  )
}

export default LoadingPage
