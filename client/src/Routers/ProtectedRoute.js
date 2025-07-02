import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useDispatch } from 'react-redux';// Adjust the path to your authSlice
import { signoutUser } from '../Redux/User/userSlice';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        const exp = decodedToken.exp;

        // Check if token is expired
        if (Date.now() >= exp * 1000) {
          throw new Error('Token expired');
        }

        if (!requiredRole.includes(userRole)) {
          navigate('/forbidden'); // Redirect to Forbidden page if the user's role doesn't match the required role
        }
      } catch (error) {
        console.error('Invalid or expired token:', error);
        localStorage.removeItem('authToken'); // Clear the invalid or expired token
        dispatch(signoutUser()); // Dispatch signout action
        navigate('/login'); // Redirect to login page
      }
    } else {
      navigate('/login'); // Redirect to login page if no token is found
    }
  }, [navigate, requiredRole, dispatch]);

  return children;
};

export default ProtectedRoute;
