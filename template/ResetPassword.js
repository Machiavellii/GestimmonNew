
const template1 = (url) => {
    return 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'+
            'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
            `${url}\n\n` +
            'If you did not request this, please ignore this email and your password wil remain unchanged.\n'

} 

module.exports = { template1 };