import { signIn } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRouter } from 'next/router';

const SignIn = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await signIn('google', { callbackUrl: '/auth/profil' });
    if (result) {
      router.push('/auth/profil');
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body text-center">
          <h1 className="card-title mb-4">Sign In</h1>
          <p className="text-muted mb-4">Please sign in to your account</p>
          <button 
            className="btn btn-danger w-100"
            onClick={handleSignIn}
          >
            <i className="bi bi-google me-2"></i> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;