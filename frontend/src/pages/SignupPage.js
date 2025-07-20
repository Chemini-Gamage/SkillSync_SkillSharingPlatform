import AuthLayout from "../components/AuthLayout"
import SignupForm from "../components/SignupForm"

const SignupPage = () => {
  return (
    <AuthLayout title="Join LinkedIn" footerText="Already on LinkedIn?" footerLink="/login" footerLinkText="Sign in">
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
