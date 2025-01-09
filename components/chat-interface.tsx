"use client";

import { useState, useTransition } from "react";
// useActionState のインポートを削除
import { generatePR, GeneratePRResponse } from "@/app/actions/generate-pr";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInterfaceProps {
  section: string;
  onClose: () => void;
  onContentGenerated: (content: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({
  section,
  onClose,
  onContentGenerated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `${section}についての情報を教えてください。具体的にどのような内容を書きたいですか？`,
    },
  ]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<GeneratePRResponse>({
    success: false,
    error: "",
  });

  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      try {
        const result = await generatePR(section, input);
        console.log("generatePR result:", result);
        setState(result);

        if (result.success) {
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content: result.content,
            },
          ]);
        } else {
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content:
                result.error ?? "エラーが発生しました。もう一度お試しください。",
            },
          ]);
        }
      } catch (error) {
        console.error("Error generating PR:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "予期せぬエラーが発生しました。もう一度お試しください。",
          },
        ]);
      }
    });
  };

  const handleUseContent = () => {
    const generatedContent = messages[messages.length - 1].content;
    onContentGenerated(generatedContent);
    onClose();
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{section} - AI自動生成</CardTitle>
        <Button onClick={onClose} variant="ghost" className="absolute top-2 right-2">
          ✕
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={isPending}>
            {isPending ? "送信中..." : "送信"}
          </Button>
        </div>
        {messages.length > 1 && (
          <Button onClick={handleUseContent} className="w-full">
            生成された内容を使用
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
