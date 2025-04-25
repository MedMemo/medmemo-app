"use client";

import { AssistantRuntimeProvider, CompositeAttachmentAdapter, SimpleImageAttachmentAdapter, SimpleTextAttachmentAdapter } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

export const Assistant = () => {
  
  const runtime = useChatRuntime({
    api: "/api/chat",
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });
  
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="grid h-dvh gap-x-2 px-4 py-4">
        { /* <ThreadList /> */ }
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default Assistant
