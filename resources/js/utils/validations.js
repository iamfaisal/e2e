const isEmpty = {
    type: "isEmpty",
    error: "Cannot be left empty"
};

const isPoBox = {
    type: "sanitizedContains:PO Box",
    error: "We do not currently ship to PO Boxes"
};

const isPo = {
    type: "equals:PO|APO|DPO|FPO",
    error: "We do not currently ship to PO Boxes"
};

const isAlphaNumeric = {
    type: "isAlphanumeric",
    error: "Invalid"
};

const isEmail = {
    type: "isEmail",
    error: "Invalid email address"
};

const isPostalCode = {
    type: "isPostalCode",
    error: "Invalid"
};

const isMobilePhone = {
    type: "isMobilePhone",
    error: "Invalid phone number"
};

const isNumber = {
    type: "isNumber",
    error: "Should be a number"
};

const isNumeric = {
    type: "isNumeric",
    error: "Should be a numeric"
};

const usPhoneLength = {
    type: "minLength:14",
    error: "Invalid phone number"
};

const ukPhoneLength = {
    type: "minLength:12",
    error: "Invalid phone number"
};

export const validations = {
    isEmpty,
    isPoBox,
    isAlphaNumeric,
    isEmail,
    isPostalCode,
    isPo,
    isMobilePhone,
    isNumber,
    isNumeric,
    usPhoneLength,
    ukPhoneLength
};