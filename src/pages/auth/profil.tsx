import { getSession } from "next-auth/react";
import { Session } from "next-auth"; 
import { GetServerSidePropsContext } from "next";
import Link from 'next/link'; // Import Link
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface UserProfileProps {
  session: Session | null;
}

const UserProfile = ({ session }: UserProfileProps) => {
  if (!session || !session.user) {
    return <p>Loading...</p>; 
  }

  // Retrieve user data
  const { name, email } = session.user;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #ff7f7f, #ffb3b3)' }}>
      <div className="card shadow-lg p-4" style={{ width: '600px', borderRadius: '12px' }}>
        <div className="card-body text-center">
          <h1 className="mb-4" style={{ color: '#ff4d4d' }}>User Profile</h1>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Date of Birth:</strong></p>
          <p><strong>Address:</strong></p>
          <p><strong>Phone Number:</strong></p>
          <Link href="/auth/formulaire" className="btn btn-outline-danger mt-3" style={{ borderRadius: '25px' }}>
            <i className="bi bi-pencil me-2"></i>Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context); 

  return {
    props: { session },
  };
}

export default UserProfile;
