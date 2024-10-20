export abstract class Adapter {
  public didPrime = false;

  abstract connect(args: {
    typeDefs?: string;
    shouldSkipPrime?: boolean;
  }): Promise<void>;

  abstract sendText(text: string): Promise<string>;
}
