export function setUpAnalytics(application: ng.IModule): void {
    const GOOGLE_ANALYTICS_KEY = process.env.hasOwnProperty('GOOGLE_ANALYTICS_KEY')
        ? process.env.GOOGLE_ANALYTICS_KEY
        : '';
    if (GOOGLE_ANALYTICS_KEY.length > 0) {
        application.config([
            'AnalyticsProvider',
            (analyticsProvider: angular.google.analytics.AnalyticsProvider) => {
                analyticsProvider.setAccount(GOOGLE_ANALYTICS_KEY);
            }
        ]);
    }
}
