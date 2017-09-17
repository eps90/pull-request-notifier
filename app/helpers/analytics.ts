const GOOGLE_ANALYTICS_KEY = process.env.GOOGLE_ANALYTICS_KEY || '';

export function setUpAnalytics(application: ng.IModule): void {
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
                    .setPageEvent('$stateChangeSuccess')
                    .enterDebugMode(DEV);

                if (TEST) {
                    analyticsProvider.enterTestMode();
                }
            }
        ]);
    }
}

export function setUpAnalyticsTrackPrefix(application: ng.IModule, pagePrefix: string): void {
    if (GOOGLE_ANALYTICS_KEY.length > 0) {
        application.config([
            'AnalyticsProvider',
            (analyticsProvider) => {
                analyticsProvider.trackPrefix(pagePrefix);
            }
        ]);
    }
}
