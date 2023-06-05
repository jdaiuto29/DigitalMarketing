// userReducer.js

import axios from 'axios';

const defaultState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  loaded: false,
};

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_ATTEMPT_LOGOUT = 'USER_ATTEMPT_LOGOUT';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
const USER_ATTEMPT_LOGIN = 'USER_ATTEMPT_LOGIN';

export const loggedIn = (user) => {
  return {
    type: USER_LOGGED_IN,
    user,
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: USER_ATTEMPT_LOGOUT });
    localStorage.removeItem('token'); // Remove the token from local storage or cookie
    localStorage.removeItem('currentUser'); // Remove the currentUser from local storage
    dispatch({ type: USER_LOGGED_OUT });
  };
};

export const checkUser = () => {
  return (dispatch) => {
    dispatch({ type: USER_ATTEMPT_LOGIN });

    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    if (token) {
      // Send the token in the Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios
        .get('/api/v1/users/current')
        .then((res) => {
          if (res.status === 200) {
            const user = res.data;
            dispatch(loggedIn(user));

            // Persist the currentUser in local storage
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            throw new Error('User not authenticated');
          }
        })
        .catch((err) => {
          console.error('Error checking user:', err);
          dispatch({ type: USER_LOGGED_OUT });

          // Remove the currentUser from local storage if authentication fails
          localStorage.removeItem('currentUser');
        });
    } else {
      dispatch({ type: USER_LOGGED_OUT });

      // Remove the currentUser from local storage if no token is found
      localStorage.removeItem('currentUser');
    }
  };
};

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        currentUser: action.user,
        loaded: true,
      };
    case USER_LOGGED_OUT:
      return {
        ...state,
        currentUser: null,
        loaded: true,
      };
    default:
      return state;
  }
};
