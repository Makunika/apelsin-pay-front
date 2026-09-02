import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useAuthState} from "../../context";
import {redirectToLogin} from "../../api/AuthApi"

function AuthGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;

    useEffect(() => {
        if (!isLoggedIn) {
            redirectToLogin()
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null;
    }

    return children;
}

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
