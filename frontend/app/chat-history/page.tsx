"use client";

import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";


const cloud = new AssistantCloud({
  baseUrl: process.env["NEXT_PUBLIC_ASSISTANT_BASE_URL"]!,
  anonymous: true,
})
export const Assistant = () => {
  const runtime = useChatRuntime({
    cloud,
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="grid h-dvh gap-x-2 px-4 py-4">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default Assistant