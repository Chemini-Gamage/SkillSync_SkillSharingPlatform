import AuthLayout from "../components/AuthLayout"
import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <AuthLayout title="Sign in" footerText="New to LinkedIn?" footerLink="/signup" footerLinkText="Join now">
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
