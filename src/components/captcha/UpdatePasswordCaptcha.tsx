import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
    siteKey: string;
    onVerify: (token: string | null) => void;
    onError?: () => void;
    onExpire?: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ siteKey, onVerify, onError, onExpire }) => {
    return (
        <div className="captcha-container">
            <ReCAPTCHA
                sitekey={siteKey}
                onChange={onVerify}
                onErrored={onError}
                onExpired={onExpire}
            />
        </div>
    );
};

export default Captcha;
