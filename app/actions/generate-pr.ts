"use server"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '', 
})

export async function generatePR(section: string, userInput: string) {
  console.log("generatePR called")
  console.log("section:", section)
  console.log("userInput:", userInput)

  const prompt = `
    以下の就活用自己PRの${section}セクションについて、ユーザーの入力を基に適切な文章を生成してください。
    
    ユーザーの入力: ${userInput}

    以下の点を考慮して、300〜500文字程度の文章を生成してください：
    1. 具体的なエピソードを含める
    2. 行動とその結果を明確に示す
    3. 学んだことや成長した点を強調する
    4. 企業にとって魅力的な能力やスキルを示す

    生成された文章：
  `

  try {
    // OpenAI API を呼び出す
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest", // 動作する例と同じモデル名を使用
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    // OpenAIのレスポンスは completion.choices[] に入っている
    const generated = completion.choices[0].message?.content || ''

    return {
      success: true,
      content: generated,
    }
  } catch (error: any) {
    console.error("Error generating PR:", error.response?.data || error.message || error)
    return {
      success: false,
      error: "AI生成中にエラーが発生しました。",
    }
  }
}
