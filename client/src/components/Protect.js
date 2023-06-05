import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function Protect(props) {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!currentUser && isMounted.current) {
      navigate('/sign-in');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return <>{props.children}</>;
}

export default Protect;
