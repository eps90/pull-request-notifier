export function setUpLogglyLogger(application: ng.IModule) {
    const logglyToken = process.env.hasOwnProperty('LOGGLY_TOKEN')
        ? process.env.LOGGLY_TOKEN
        : '';
    if (logglyToken.length > 0) {
        application.config(['LogglyLoggerProvider', (logglyLoggerProvider) => {
            logglyLoggerProvider
                .inputToken(logglyToken)
                .inputTag('pull-request-notifier')
                .sendConsoleErrors(true);
        }]);
    }
}
