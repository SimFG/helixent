import type { ToolUseContent } from "@/foundation";

export type ApprovalRequest = {
  toolUse: ToolUseContent;
  // eslint-disable-next-line no-unused-vars
  resolve: (approved: boolean) => void;
};

const MAX_QUEUE_SIZE = 20;

export class ApprovalManager {
  private _queue: ApprovalRequest[] = [];
  private _currentRequest?: ApprovalRequest;
  // eslint-disable-next-line no-unused-vars
  private _subscriber?: (req: ApprovalRequest | null) => void;

  askUser = (toolUse: ToolUseContent): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this._queue.length >= MAX_QUEUE_SIZE) {
        console.warn(`[ApprovalManager] Queue overflow. Denying tool ${toolUse.name}.`);
        resolve(false);
        return;
      }
      this._queue.push({ toolUse, resolve });
      this._processQueue();
    });
  };

  private _processQueue() {
    if (this._currentRequest || this._queue.length === 0) {
      if (this._queue.length === 0 && !this._currentRequest) {
        this._subscriber?.(null);
      }
      return;
    }

    this._currentRequest = this._queue.shift()!;
    this._subscriber?.(this._currentRequest);
  }

  respond = (approved: boolean) => {
    if (!this._currentRequest) return;
    this._currentRequest.resolve(approved);
    this._currentRequest = undefined;
    this._processQueue();
  };

  // eslint-disable-next-line no-unused-vars
  subscribe(callback: (req: ApprovalRequest | null) => void) {
    this._subscriber = callback;
    // Process any items that were queued before subscription
    this._processQueue();
    return () => {
      this._subscriber = undefined;
    };
  }
}

export const globalApprovalManager = new ApprovalManager();
