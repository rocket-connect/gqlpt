export interface AdapterResponse {
  content: string;
  conversationId?: string;
}

export abstract class Adapter {
  abstract connect(): Promise<void>;
  abstract sendText(
    text: string,
    conversationId?: string,
  ): Promise<AdapterResponse>;
}
