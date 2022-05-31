export const BASE_AUTH_URL = "http://login.pshiblo.xyz"
const BASE_AUTHORIZE_URL = `${BASE_AUTH_URL}/oauth/authorize`

export const getAuthorizationUrl = (state) => `${BASE_AUTHORIZE_URL}/?client_id=browser_payment&redirect_uri=http://payment.pshiblo.xyz/login&scope=user_payment&response_type=token&response_mode=query&state=${state}`

