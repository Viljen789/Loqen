export type Category = {
    id: number;
    name: string;
    accentColor: string;
    iconName?: string;
};

export const CATEGORIES: Category[] = [
    {id: -1, name: 'AddNew', accentColor: '#388e3c'},
    {id: 0, name: 'Default', accentColor: '#888888'},
    {id: 1, name: 'Focus', accentColor: '#8e44ad'},
    {id: 2, name: 'Break-Mode', accentColor: '#3498db'},

];
