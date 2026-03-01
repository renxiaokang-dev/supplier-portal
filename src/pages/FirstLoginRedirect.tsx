import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function FirstLoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/first-login');
  }, [navigate]);

  return null;
}
