import { IconBrandGoogle } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconBrandApple } from '@tabler/icons-react';

export const LandingPage = () => {
  return (
    <div className="login-container">
      <h2 className="form-title">Log in with.</h2>
      <div className="social-login">
        <button className="social-button">
          <IconBrandGoogle size={30} color="#000" stroke={1.5} />
          <p>
            Google
          </p>
        </button>
        <button className="social-button">
          <IconBrandApple size={30} color="#000" stroke={1.5} />
          <p>
            Apple
          </p>
        </button>
      </div>

      <p className="separator"><span>or</span></p>

      <form action="#" className="login-form">
        <div className="input-wrapper">
          <input required type="email" className="input-field" placeholder="Email address" />
          <IconMail size={30} color="#000" stroke={1.5} />
        </div>
      </form>

      <form action="#" className="login-form">
        <div className="input-wrapper">
          <input required type="password" className="input-field" placeholder="Password" />
          <IconLock size={30} color="#000" stroke={1.5} />
        </div>
        <a href="#forgot-password" className="forgot-password-link">Forgot password?</a>
        <button className="login-button">Log in</button>
      </form>

      <p className="signup-text">Don't have an account? <a href="#signup">Sign up</a></p>
    </div>
  );
};