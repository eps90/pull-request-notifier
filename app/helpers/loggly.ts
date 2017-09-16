export function setUpLogglyLogger(application: ng.IModule) {
    if (process.env.LOGGLY_TOKEN.length > 0) {
        application.config(['LogglyLoggerProvider', (logglyLoggerProvider) => {
            logglyLoggerProvider
                .inputToken(process.env.LOGGLY_TOKEN)
                .inputTag('pull-request-notifier')
                .sendConsoleErrors(true);
        }]);
    }
}
