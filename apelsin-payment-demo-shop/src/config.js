// Настройки демо-магазина. Переопределяются на этапе сборки CRA через REACT_APP_* (см. .env.example),
// по умолчанию — продовые значения.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://api.graduate.pshiblo.xyz/";
export const MAIN_UI_URL = process.env.REACT_APP_MAIN_URL || "http://graduate.pshiblo.xyz";
export const SHOP_URL = process.env.REACT_APP_SHOP_URL || "http://demoshop.graduate.pshiblo.xyz";

// Мерчант, от имени которого магазин создаёт заказы: id компании в info-business-service
// и её apiKey (уходит в заголовке Authorization в payment-service).
export const COMPANY_ID = Number(process.env.REACT_APP_COMPANY_ID || 4);
export const COMPANY_API_KEY = process.env.REACT_APP_COMPANY_API_KEY || "lLADnJEtcHzWb4r8h2Nx";
