"use server";

import OpenAI from "openai";

// ❶ 戻り値として使う型を定義しておく
export type GeneratePRResponse =
  | { success: true; content: string }          // 成功パターン
  | { success: false; error: string };         // 失敗パターン

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function generatePR(
  section: string,
  userInput: string
): Promise<GeneratePRResponse> {
  console.log("generatePR called");
  console.log("section:", section);
  console.log("userInput:", userInput);

  const prompt = `
    以下の就活用自己PRの${section}セクションについて、ユーザーの入力を基に適切な文章を生成してください。

    ユーザーの入力: ${userInput}

    以下の点を考慮して、300〜500文字程度の文章を生成してください：
    1. 具体的なエピソードを含める
    2. 行動とその結果を明確に示す
    3. 学んだことや成長した点を強調する
    4. 企業にとって魅力的な能力やスキルを示す

    生成された文章：
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generated = completion.choices[0].message?.content || "";

    // ❷ 成功時は success: true と content を返す
    return {
      success: true,
      content: generated,
    };
  } catch (error: any) {
    console.error("Error generating PR:", error.response?.data || error.message || error);
    // ❸ 失敗時は success: false と error を返す
    return {
      success: false,
      error: "AI生成中にエラーが発生しました。",
    };
  }
}
