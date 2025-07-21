import { Link } from "react-router-dom"
import "../styles/Auth.css"

const AuthLayout = ({ children, title, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/logo1.png" alt="LinkedIn Logo" className="auth-logo" />
        <h1>LinkedIn</h1>
      </div>
      <div className="auth-card">
        <h2>{title}</h2>
        {children}
      </div>
      <div className="auth-footer">
        <p>
          {footerText} <Link to={footerLink}>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
