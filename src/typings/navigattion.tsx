export interface Navigation {
    navigate: (
        name: string,
        params?: { screen?: string; params?: any }
    ) => void;
}
