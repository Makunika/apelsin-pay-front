import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {logout, useAuthDispatch, useAuthState} from "../../context";
import {redirectToLogin} from "../../api/AuthApi"
import {currentOrderId} from "../../api/ApiSecured";
import {getAccessToken, isTokenExpired} from "../tokenStorage";

function AuthGuard({ children }) {
    const account = useAuthState();
    const { isLoggedIn } = account;
    const location = useLocation();
    const dispatch = useAuthDispatch();

    useEffect(() => {
        const token = getAccessToken()
        if (token && isTokenExpired(token)) {
            logout(dispatch)
        }
    }, [location, dispatch]);

    useEffect(() => {
        if (!isLoggedIn) {
            // токена нет или он истёк — новый вход через PKCE с тем же заказом
            redirectToLogin(currentOrderId())
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
