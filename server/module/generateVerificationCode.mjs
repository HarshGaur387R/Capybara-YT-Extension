import jsonwebtoken from 'jsonwebtoken'
const jwt = jsonwebtoken;

export default function generateVerificationCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters.charAt(randomIndex);
    }

    const token = jwt.sign({msg:"done"},verificationCode,{"expiresIn":"15m"});

    return {verificationCode,token};
}
