import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuthState} from "../../context";

function AuthGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return children;
}

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
