import "../styles/Auth.css"

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src="/logo1.png" alt="LinkedIn Logo" className="auth-logo" />
        <div className="loading-spinner"></div>
        <h1>LinkedIn Clone</h1>
        <p>Connecting professionals worldwide</p>
      </div>
    </div>
  )
}

export default LoadingPage
