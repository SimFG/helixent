import { useEffect, useState } from "react";

import { globalApprovalManager, type ApprovalRequest } from "@/agent/approval";

export function useApprovalManager() {
  const [request, setRequest] = useState<ApprovalRequest | null>(null);

  useEffect(() => {
    return globalApprovalManager.subscribe((req) => {
      // req will be null when queue is empty, or the next request object
      setRequest(req);
    });
  }, []);

  const respond = (approved: boolean) => {
    if (request) {
      // globalApprovalManager will handle resolving and popping the next item.
      // It will trigger the subscribe callback with the next item (or null).
      globalApprovalManager.respond(approved);
    }
  };

  return {
    approvalRequest: request,
    respondToApproval: respond,
  };
}
