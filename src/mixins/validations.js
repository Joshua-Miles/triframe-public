export const emailRequirements = ({ property, errors }) => {
    if(property != undefined && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(property)) errors.push('must be a valid email')
}

export const passwordRequirements = ({ property, errors }) => {
    if(property != undefined && property.length < 5) errors.push('must be longer than 5 characters')
}