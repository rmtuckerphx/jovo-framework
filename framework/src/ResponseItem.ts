export interface ResponseItem {
    getSpeech?(): string;
    setSpeech?(value: string): void
    // getReprompt(): string;
    // setReprompt(value: string): void
}