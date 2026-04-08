import { Box, Text, useInput } from "ink";
import React from "react";

import type { ToolUseContent } from "@/foundation";

export function ApprovalPrompt({
  toolUse,
  onApprove,
  onDeny,
}: {
  toolUse: ToolUseContent;
  onApprove: () => void;
  onDeny: () => void;
}) {
  useInput((input: string) => {
    if (input.toLowerCase() === "y") {
      onApprove();
    } else if (input.toLowerCase() === "n") {
      onDeny();
    }
  });

  const argsStr = JSON.stringify(toolUse.input, null, 2);
  const displayArgs = argsStr.length > 500 ? argsStr.slice(0, 500) + "\n... (truncated)" : argsStr;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1}>
      <Text color="yellow" bold>
        ⚠️ Agent wants to run a high-risk tool: <Text color="white">{toolUse.name}</Text>
      </Text>
      <Box marginTop={1}>
        <Text dimColor>{displayArgs}</Text>
      </Box>
      <Box marginTop={1}>
        <Text bold>
          Allow execution? <Text color="green">[y/N]</Text>
        </Text>
      </Box>
    </Box>
  );
}
