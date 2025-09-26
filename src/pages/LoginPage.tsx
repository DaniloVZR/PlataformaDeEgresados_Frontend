import { IconBrandGoogle } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconBrandApple } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import "../styles/FormularioAutenticacion.css";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-background">
      <div className="auth-container">
        <h2 className="form-title">Log in with</h2>
        <div className="social-login">
          <button className="social-button">
            <IconBrandGoogle size={30} color="#000" stroke={1.5} />
            <p>Google</p>
          </button>
          <button className="social-button">
            <IconBrandApple size={30} color="#000" stroke={1.5} />
            <p>Apple</p>
          </button>
        </div>

        <p className="separator"><span>or</span></p>

        <form action="#" className="auth-form">
          <div className="input-wrapper">
            <input required type="email" className="input-field" placeholder="Email address" />
            <IconMail size={30} color="#000" stroke={1.5} />
          </div>
        </form>

        <form action="#" className="auth-form">
          <div className="input-wrapper">
            <input required type="password" className="input-field" placeholder="Password" />
            <IconLock size={30} color="#000" stroke={1.5} />
          </div>
          <a href="#forgot-password" className="forgot-password-link">Forgot password?</a>
          <button className="auth-button">Log in</button>
        </form>

        <p className="auth-text">Don't have an account?
          <a onClick={() => navigate("/register")}>{' '}Sign up</a>
        </p>
      </div>
    </div>
  );
};
