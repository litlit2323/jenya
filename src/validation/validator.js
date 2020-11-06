import validator from "validator"
import {cyrillicOrLateinschriftRegexp, phoneNumberRegexp} from "@validation/regexps";

export const isNubmer = (errorMessage, object, key) => {
    return isNaN(object[key]) && errorMessage
}

export const isPhoneNubmer = (errorMessage, object, key) => {
    return !phoneNumberRegexp.test(object[key]) && errorMessage
}

export const isEmail = (errorMessage, object, key) => {
    return !validator.isEmail(object[key]) && errorMessage
}

export const isCyrillic = (errorMessage, object, key) => {
    return !validator.isAlpha(object[key], ["ru-RU"]) && errorMessage
}

export const isCyrillicOrLateinschrift = (errorMessage, object, key) => {
    console.log(object[key], errorMessage)
    console.log("isCyrillicOrLateinschrift", !cyrillicOrLateinschriftRegexp.test(object[key]) && errorMessage)
    return !cyrillicOrLateinschriftRegexp.test(object[key]) && errorMessage
}

export const isPresentInObject = (errorMessage, object, key) => {
    return !object[key] && errorMessage
}


const getValidationSchemaFieldCallbackResult = (validationSchemaField, object, key) => {
    const messages = []
    for (let i = 0; i < validationSchemaField.callback.length; i++) {
        const callbackResult = validationSchemaField.callback[i](validationSchemaField.errorMessage[i], object, key)
        callbackResult && messages.push(callbackResult)
    }
    return messages
}

const validateData = (object, validationSchema) => {
    const validationErrors = []
    const objKeys = Object.keys(object)
    for (let i = 0; i < objKeys.length; i++) {
        const validationSchemaField = validationSchema[objKeys[i]]
        if (validationSchemaField) {
            const errors = validationSchemaField && getValidationSchemaFieldCallbackResult(validationSchemaField, object, objKeys[i])
            if (errors.length !== 0) {
                validationErrors.push({
                    name: objKeys[i],
                    message: errors
                })
            }
        }

    }
    return validationErrors
}

export default validateData