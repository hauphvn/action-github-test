 const REGEX_PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,32}$/
 const REGEX_EMAIL = /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
 const REGEX_PHONE_NUMBER = /^0\d{9}$/;

 export {REGEX_PHONE_NUMBER, REGEX_EMAIL, REGEX_PASSWORD_STRONG};