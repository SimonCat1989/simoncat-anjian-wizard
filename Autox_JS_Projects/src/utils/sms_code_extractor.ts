const SMSCodeRegex = /.*验证码[\s:：是]*(\d{4,6}).*/;

enum SMSCodeExtractionExitCode {
    OK,
    INVALID_MESSAGE,
    NOT_FOUND
}

class SMSCodeExtractedResponse {
    constructor(
        private readonly exitCode: SMSCodeExtractionExitCode,
        private readonly resposne: string
    ) { }

    public isSuccess(): boolean {
        return this.exitCode === SMSCodeExtractionExitCode.OK;
    }

    public getCode(): string {
        return this.resposne;
    }

    public toString(): string {
        return `SMSCodeExtractedResponse[exit_code=${this.exitCode}, response=${this.resposne}]`
    }
}

export class SMSCodeExtractor {

    public static installOnce(callbackFunc: (smsCode: string) => void): void {
        let notificationThread = threads.start(function(){
            let isDone = false;
            events.observeNotification();
            events.on("notification", (notification: AutoJs.Notification) => {
                console.info(`asadfasdf  ${notification}`);
                let response = SMSCodeExtractor.extract(notification)
                if (response.isSuccess()) {
                    console.info(`[INFO] Received SMS Verification Code "${response.getCode()}"`);
                    callbackFunc(response.getCode())
                    events.removeAllListeners("notification");
                    isDone = true;
                } else {
                    console.error(`[ERROR] Can NOT receive SMS Verification Code: "${response.toString()}"`);
                }
                notification.delete();
            });

            // Keep thread on running state, until receive correct sms code
            let waitForSmsCodeBlocker = setInterval(() => {
                if (isDone) {
                    clearInterval(waitForSmsCodeBlocker);
                }
            }, 5000);
        });
        
        // Wait for thread be started
        notificationThread.waitFor();
    }

    private static extract(notification: AutoJs.Notification): SMSCodeExtractedResponse {
        let rawMessage = notification.getText();
        if (!rawMessage || !rawMessage.includes('验证码')) {
            return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.INVALID_MESSAGE, `未在消息中找到验证码信息，请确认该消息：${rawMessage}`);
        } else {
            let match = SMSCodeRegex.exec(rawMessage);
            if (!match) {
                return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.NOT_FOUND, `未在消息中找到验证码信息，请确认该消息：${rawMessage}`);
            } else {
                return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.OK, match[1]);
            }
        }
    }
}
