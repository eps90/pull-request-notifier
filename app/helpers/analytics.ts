export function setUpAnalytics(application: ng.IModule): void {
    const GOOGLE_ANALYTICS_KEY = process.env.GOOGLE_ANALYTICS_KEY || '';
    if (GOOGLE_ANALYTICS_KEY.length > 0) {
        application.config([
            'AnalyticsProvider',
            (analyticsProvider) => {
                analyticsProvider
                    .setAccount({
                        tracker: GOOGLE_ANALYTICS_KEY,
                        fields: {
                            cookieDomain: 'none'
                        },
                        set: {
                            checkProtocolTask: () => {}
                        }
                    })
                    .enterDebugMode(DEV);

                if (TEST) {
                    analyticsProvider.enterTestMode();
                }
            }
        ]);
    }
}
