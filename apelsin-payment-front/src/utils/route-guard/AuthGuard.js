import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {logout, useAuthDispatch, useAuthState} from "../../context";
import {getAuthorizationUrl} from "../../api/AuthApi"
import {isTokenExpired} from "../../api/ApiSecured";

function AuthGuard({ children }) {
    const account = useAuthState();
    const navigate = useNavigate();
    const { isLoggedIn } = account;
    const location = useLocation();
    const dispatch = useAuthDispatch();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (isTokenExpired(localStorage.getItem("token"))) {
                logout(dispatch)
            }
        }
    }, [location]);
    
    if (!isLoggedIn) {
        navigate(-1)
    }

    return children;
}

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
