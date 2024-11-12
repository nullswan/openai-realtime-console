/**
 * Type for all event logs
 */
export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

interface ToolCallbackInput {
  key: string;
  value: string;
}

interface ToolCallbackOutput {
  ok: boolean;
}

type ToolCallback = (input: ToolCallbackInput | any) => Promise<ToolCallbackOutput> | any;

export interface ToolsT {
  config: any;
  callback: ToolCallback;
}