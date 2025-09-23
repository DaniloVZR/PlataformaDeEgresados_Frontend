import { ReactComponent as GoogleIcon } from '../components/assets/google-icon.svg';



export const LandingPage = () => {
  return (
    <div className="login-container">
      <h2 className="form-title">Log inwith</h2>
      <div className="social-login">
        <button className="social-button">
          <GoogleIcon />
        </button>
      </div>
    </div>
  )
}
