export interface AnalyticsEventInterface {
    getCategory(): string;
    getAction(): string;
    getLabel(): string;
}
