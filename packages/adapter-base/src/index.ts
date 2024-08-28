export abstract class Adapter {
  abstract connect(): Promise<void>;

  abstract sendText(text: string): Promise<string>;
}
