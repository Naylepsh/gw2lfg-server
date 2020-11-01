export type Hash = (text: string) => Promise<string>;
export type Compare = (text: string, hashedText: string) => Promise<boolean>;
