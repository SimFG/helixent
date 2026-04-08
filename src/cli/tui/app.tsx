import { Box, Static } from "ink";
import { useMemo } from "react";

import { ApprovalPrompt } from "./components/approval-prompt";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { InputBox } from "./components/input-box";
import { MessageHistory, MessageHistoryItem } from "./components/message-history";
import { StreamingIndicator } from "./components/streaming-indicator";
import { TodoPanel } from "./components/todo-panel";
import { useAgentLoop } from "./hooks/use-agent-loop";
import { useApprovalManager } from "./hooks/use-approval-manager";
import { buildTodoViewState, getNextTodo } from "./todo-view";

function allDone(todos?: { status: string }[]) {
  return !!todos?.length && todos.every((t) => t.status === "completed" || t.status === "cancelled");
}

export function App() {
  const { streaming, messages, onSubmit, abort } = useAgentLoop();
  const { approvalRequest, respondToApproval } = useApprovalManager();
  
  const { latestTodos, todoSnapshots, toolUses } = useMemo(() => buildTodoViewState(messages), [messages]);
  const activeMessages = streaming ? messages.slice(-1) : [];
  const staticMessages = streaming ? messages.slice(0, -1) : messages;
  const showHeader = messages.length === 0;
  const nextTodo = getNextTodo(latestTodos)?.content;
  const hideTodos = !streaming && allDone(latestTodos);

  return (
    <Box flexDirection="column" width="100%">
      {showHeader && <Header />}
      <Box flexDirection="column" marginTop={1} rowGap={1}>
        <Static items={staticMessages}>
          {(message, index) => (
            <MessageHistoryItem
              key={`${message.role}:${index}`}
              message={message}
              messageIndex={index}
              todoSnapshots={todoSnapshots}
              toolUses={toolUses}
            />
          )}
        </Static>
        <MessageHistory
          messages={activeMessages}
          startIndex={messages.length - activeMessages.length}
          todoSnapshots={todoSnapshots}
          toolUses={toolUses}
        />
        {approvalRequest ? null : <StreamingIndicator streaming={streaming} nextTodo={nextTodo} />}
        {!hideTodos && <TodoPanel todos={latestTodos} />}
        {approvalRequest ? (
          <ApprovalPrompt
            toolUse={approvalRequest.toolUse}
            onApprove={() => respondToApproval(true)}
            onDeny={() => respondToApproval(false)}
          />
        ) : (
          <InputBox onSubmit={onSubmit} onAbort={abort} />
        )}
      </Box>
      <Footer />
    </Box>
  );
}
