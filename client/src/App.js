import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import { checkUser } from './redux/reducers/userReducer';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import { useEffect } from 'react';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Protect from './components/Protect';
import Navigation from './components/Navigation';

function App() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const loaded = useSelector((state) => state.user.loaded);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUser());

    return () => {
      // Perform cleanup if needed
    };
  }, [dispatch]);

  if (!loaded) {
    // Show loading spinner or any other loading indicator while checking user authentication
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {currentUser && <Navigation />}
      <div className="content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/home"
            element={
              currentUser ? (
                <Protect>
                  <Home />
                </Protect>
              ) : (
                <Navigate to="/sign-in" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
