import AuthLayout from "./components/AuthLayout"
import SignupForm from "./components/SignupForm"

const SignupPage = () => {
  return (
    <AuthLayout title="Join SkillSync" footerText="Already on SkillSync?" footerLink="/login" footerLinkText="Sign in">
      <SignupForm />
    </AuthLayout>
  )
}

export default SignupPage
