import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Navigate} from "react-router-dom";
import {useAuthState} from "../../context";
import {redirectToLogin} from "../../api/AuthApi"
import {isAdmin} from "../userUtils";

function AdministratorGuard({ children }) {
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

  if (!isAdmin(user)) {
    return <Navigate to="/" />
  }
  
  return children;
}

AdministratorGuard.propTypes = {
  children: PropTypes.node
};

export default AdministratorGuard;
