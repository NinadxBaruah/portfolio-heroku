import { useAuth } from "../utils/AuthContext";
import { useEffect } from "react";
export function LoginButton() {
  const { login } = useAuth();
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const authUrl = `${import.meta.env.VITE_APP_FRONTEND_URL}/projects/chat-app/api/auth/google`;
    const popup = window.open(
      authUrl,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
      }
    }, 1000);
  };

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin !== `https://${import.meta.env.VITE_APP_BACKEND_URL}`)
        return;
      const token = event.data;
      if (token) {
        // Cookies.set('token', token, { expires: 7 });
        login(token);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="text-center">
      <p>You need to login first!</p>
      <button
        type="button"
        className="login-with-google-btn mt-5"
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </button>
    </div>
  );
}
