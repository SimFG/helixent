import type { ToolUseContent } from "@/foundation";

import type { AgentMiddleware } from "../agent-middleware";

export function createApprovalMiddleware(options: {
  requiresApproval: string[];
  // eslint-disable-next-line no-unused-vars
  askUser: (toolUse: ToolUseContent) => Promise<boolean>;
}): AgentMiddleware {
  return {
    beforeToolUse: async ({ toolUse }) => {
      if (options.requiresApproval.includes(toolUse.name)) {
        const approved = await options.askUser(toolUse);
        if (!approved) {
          return { 
            __skip: true, 
            result: `User denied execution of tool: ${toolUse.name}. You must either find an alternative approach or ask the user for clarification.`
          };
        }
      }
    },
  };
}
