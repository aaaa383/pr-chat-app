"use server";

import OpenAI from "openai";

export type GeneratePRResponse =
  | { success: true; content: string }
  | { success: false; error: string };

// ❶ ChatInterface 側の "Message" と同じ構造を定義
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// OpenAI初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

// ❷ generatePR は「これまでの会話履歴」と「section」などの追加要素を受け取る
export async function generatePR(
  messages: Message[],
  section: string
): Promise<GeneratePRResponse> {
  console.log("generatePR called");
  console.log("section:", section);
  console.log("messages:", messages);

  // ❸ system ロールとして最初に「あなたはキャリアコンサルタント...」という指示を追加
  //    これにより、常に一番最初のコンテキストとして AI が意識するようにする
  const systemPrompt = `
あなたは、学生の就職活動をサポートするプロのキャリアコンサルタントです。
ユーザーである学生から、学生時代に力をいれたことの活動内容を聞き出します。
ユーザーとの対話を通して、ユーザーが自身の学生時代の活動実績を棚卸しをし、
自分の強みの再認識と、自己PR文の作成のサポートを目指します。

#手順
まず、以下の文章をユーザーに与えてください。
「これから学生時代に力を入れたことについて、いくつか質問します。全部で10問ほどあります。」

1. 学生時代に力をいれたことを聞き出す質問をしてください。
2. 以下の項目を順番にひとつずつすべて質問してください。
・何に取り組んだか（具体的な内容）
・いつからいつまで
・あなたの役割
・動機
・設定した目標の有無
・直面した課題や背景
・課題を乗り越えるための工夫や行動
・取得した資格の有無
・学びと成長
3. 最後にユーザーが提供した回答と以下の制約条件を基に、
学生時代に力をいれたことの活動における最高の自己PR文を出力してください。
4. ユーザーの回答は抜け漏れなく、なるべく忠実に自己PR文に反映させてください。

#制約条件
・ユーザーに与える質問は、中学生でもわかるくらいの、単純で簡潔な質問にしてください。
・質問は1回に1つだけです。
・具体的な事例や行動が引き出せるような質問をしてください。

# Output format
・最後の自己PR文はPREP法に基づき、見出しのない、一つの文章で出力してください。（文字数は350～450文字程度）
・文章は日本語で、流れが自然で論理的であることを重視してください。

以上を踏まえて、あなたはキャリアコンサルタントとして丁寧に受け答えしてください。
`;

  try {
    // ❹ OpenAIチャットAPIで渡す messages の先頭に system ロールを注入
    //    あとはフロントからの messages をそのまま後ろにつなげる
    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        // OpenAIでは "assistant" か "user" か "system"
        // 互換性があるため流用可能。必要に応じて変換する。
        role: m.role,
        content: m.content,
      })),
    ];

    // ❺ ChatCompletionを呼ぶ
    const completion = await openai.chat.completions.create({
      // 参考: https://platform.openai.com/docs/models
      model: "chatgpt-4o-latest", // or "gpt-4" if you have access
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      messages: openAIMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    // ❻ アシスタントが返した応答
    const generated = completion.choices[0].message?.content || "";

    return {
      success: true,
      content: generated,
    };
  } catch (error: any) {
    console.error("Error generating PR:", error.response?.data || error.message || error);
    return {
      success: false,
      error: "AI生成中にエラーが発生しました。",
    };
  }
}