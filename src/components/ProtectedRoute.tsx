import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      setHasChecked(true);
      if (!isAuthenticated) {
        // 如果未登录且不在登录相关页面，跳转到演示页面
        if (!location.pathname.startsWith('/login') && 
            !location.pathname.startsWith('/account-setup') &&
            location.pathname !== '/demo') {
          navigate('/demo');
        }
      }
    }
  }, [isAuthenticated, navigate, location.pathname, hasChecked]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}