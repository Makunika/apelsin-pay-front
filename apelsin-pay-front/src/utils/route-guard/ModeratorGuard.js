import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Navigate} from "react-router-dom";
import {useAuthState} from "../../context";
import {redirectToLogin} from "../../api/AuthApi"
import {isModerator} from "../userUtils";

function ModeratorGuard({ children }) {
  const account = useAuthState();
  const { isLoggedIn, user } = account;

  useEffect(() => {
    if (!isLoggedIn) {
      redirectToLogin()
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  if (!isModerator(user)) {
    return <Navigate to="/" />
  }
  
  return children;
}

ModeratorGuard.propTypes = {
  children: PropTypes.node
};

export default ModeratorGuard;
