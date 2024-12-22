class UtilFunctions {
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    static generateOTPExpiry() {
        const now = new Date();
        const otpExpire = new Date(now.getTime() + 15 * 60 * 1000);
        return otpExpire;
    }
}

export default UtilFunctions;
