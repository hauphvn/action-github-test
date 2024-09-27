import {VALIDATION_MESSAGE} from "./ValidationText.ts";
import * as yup from 'yup'
import {REGEX_EMAIL, REGEX_PHONE_NUMBER} from "./CommonRegex.ts";
export const email = yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .email(VALIDATION_MESSAGE.INVALID_EMAIL)
    .matches(REGEX_EMAIL, VALIDATION_MESSAGE.INVALID_EMAIL)
export const stringRequired = yup.string().required(VALIDATION_MESSAGE.REQUIRED)
export const numberRequired = yup
    .number()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .typeError(VALIDATION_MESSAGE.ONLY_NUMBER)
    .nullable()
export const numberNotPositiveRequired = yup
    .number()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .min(0, VALIDATION_MESSAGE.NOT_NUMBER_POSITIVE)
    .typeError(VALIDATION_MESSAGE.ONLY_NUMBER)
export const stringRequiredLimitSmall = yup.string().required(VALIDATION_MESSAGE.REQUIRED).nullable()
export const stringRequiredLimitBig = yup.string().required(VALIDATION_MESSAGE.REQUIRED).nullable()
export const arrayStringNormal = yup
    .array()
    // .of(yup.string())
    .nullable()
export const arrayStringRequired = yup
    .array()
    // .of(yup.string())
    .nullable()
    .min(0)
    .required(VALIDATION_MESSAGE.REQUIRED)
export const numberLimitBig = yup.number().required(VALIDATION_MESSAGE.REQUIRED).min(1, VALIDATION_MESSAGE.REQUIRED)
export const numberMoneyRequired = yup
    .number()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .min(0, VALIDATION_MESSAGE.MIN_ZERO)
    .typeError(VALIDATION_MESSAGE.ONLY_NUMBER)
export const phoneNumberFormat = yup
    .string()
    .matches(REGEX_PHONE_NUMBER, VALIDATION_MESSAGE.PHONE_NUMBER_WRONG_FORMAT)
    .nullable()
export const phoneNumberSimple = yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .matches(REGEX_PHONE_NUMBER, VALIDATION_MESSAGE.PHONE_NUMBER_WRONG_FORMAT)
export const stringNormal = yup.string().nullable()
export const typeImageString = yup.string().required(VALIDATION_MESSAGE.REQUIRED_IMAGE)
    .matches(/image/, VALIDATION_MESSAGE.REQUIRED_IMAGE)
export const password = yup.string().required(VALIDATION_MESSAGE.REQUIRED)
export const passwordLogin = yup.string().required(VALIDATION_MESSAGE.REQUIRED)
export const passwordAllowEmpty = yup.lazy((value) => (value === '' ? yup.string() : password))
export const confirmPassword = yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .oneOf([yup.ref('newPassword')], VALIDATION_MESSAGE.PASSWORD_NOT_MATCH)
export const notSameOldPassword = yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .min(6, VALIDATION_MESSAGE.MIN_PASSWORD)
    .notOneOf([yup.ref('oldPassword')], VALIDATION_MESSAGE.PASSWORD_NEW_NOT_SAME_OLD)
export const passwordBasic = yup.string().required(VALIDATION_MESSAGE.REQUIRED).min(6, VALIDATION_MESSAGE.MIN_PASSWORD)
