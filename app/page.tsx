"use client";

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentSection } from "@/components/content-section"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatInterface } from "@/components/chat-interface"

const TEMPLATE_TEXT = `■状況説明（いつ、何に、どのような役割で取り組んだのか）
■行動した動機（なぜ取り組んだのか）
■直面した課題や背景（なにが大変だったのか）
■課題を乗り越えるための工夫・行動（どのように工夫・行動したのか）
■結果（どのように変化したのか）`

export default function Page() {
  // 「どのセクションでAI生成中か」を管理
  const [activeChatSection, setActiveChatSection] = useState<string | null>(null)

  // 各セクションの入力データをオブジェクトで管理
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({})

  // AI生成ボタン押下でChatInterfaceを表示するため
  const handleAIGeneration = (section: string) => {
    setActiveChatSection(section)
  }

  // 「生成された内容を使用」ボタン押下時に呼ばれる
  // ChatInterface -> onContentGenerated -> handleContentGenerated
  // ⇒ セクションに応じた入力欄(ContentSectionなど)に反映する
  const handleContentGenerated = (section: string, content: string) => {
    setSectionContents(prev => ({
      ...prev,
      [section]: content
    }))
  }

  return (
    <TooltipProvider>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">PR情報</CardTitle>
            <p className="text-sm text-muted-foreground">
              「就活準備サポート期間」終了後、企業からのオファーが本格化するタイミングまでに入力完了しましょう。
              現段階では、可能な範囲での入力で大丈夫です。下書き機能を活用し、少しずつ進めていきましょう。
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ContentSection
              title="学生時代に力を入れたこと"
              required
              templateText={TEMPLATE_TEXT}
              onAIGeneration={() => handleAIGeneration("学生時代に力を入れたこと")}
              content={sectionContents["学生時代に力を入れたこと"]}
            />

            <ContentSection
              title="自己PR（やりがいを感じる場面など）"
              templateText={TEMPLATE_TEXT}
              onAIGeneration={() => handleAIGeneration("自己PR")}
              content={sectionContents["自己PR"]}
            />

            <ContentSection
              title="研究概要（研究テーマ・学習内容など）"
              tooltip="※研究テーマが未決定の場合は、これまでやんできた内容（得意な科目、興味を持った授業など）をご入力ください。
              ※企業に見せてもよい内容かどうかわからない場合は指導教員に確認の上、可能な範囲で入力してください。"
              templateText={TEMPLATE_TEXT}
              onAIGeneration={() => handleAIGeneration("研究概要")}
              content={sectionContents["研究概要"]}
            />

            <div className="space-y-4 py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                研究室紹介ページURL
              </h2>
              <Input placeholder="研究室紹介ページURLを入力" />
            </div>

            <div className="space-y-4 py-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                研究室の先輩の就職先企業
              </h2>
              <Textarea 
                placeholder="先輩の就職先を入力してください。興味企業からのオファーが増えます。"
                className="min-h-[100px]"
              />
            </div>

            <ContentSection
              title="サークル・部活動・所属団体/学会"
              showTitle
              showDates
              showImageUpload
              templateText={TEMPLATE_TEXT}
              onAIGeneration={() => handleAIGeneration("サークル・部活動・所属団体/学会")}
              content={sectionContents["サークル・部活動・所属団体/学会"]}
            />

            <ContentSection
              title="活動実績"
              showTitle
              showDates
              showImageUpload
              templateText={TEMPLATE_TEXT}
              placeholder="（ハッカソン・ロボコン・研究室・アプリ制作・QQコンテスト・留学・ボランティア）"
              onAIGeneration={() => handleAIGeneration("活動実績")}
              content={sectionContents["活動実績"]}
            />

            <ContentSection
              title="表彰・受賞歴"
              showTitle
              showDates
              showImageUpload
              placeholder="■受賞歴・受賞タイトル（年度・受賞内容）"
              onAIGeneration={() => handleAIGeneration("表彰・受賞歴")}
              content={sectionContents["表彰・受賞歴"]}
            />

            <ContentSection
              title="インターン・アルバイト"
              showTitle
              showDates
              showImageUpload
              templateText={TEMPLATE_TEXT}
              onAIGeneration={() => handleAIGeneration("インターン・アルバイト")}
              content={sectionContents["インターン・アルバイト"]}
            />

            <div className="flex justify-center gap-4 pt-6">
              <Button variant="outline">
                あとで登録する
              </Button>
              <Button>
                登録して利用開始
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ChatInterface をモーダル的に出す */}
        {activeChatSection && (
          <ChatInterface
            section={activeChatSection}
            onClose={() => setActiveChatSection(null)}
            onContentGenerated={(content) => handleContentGenerated(activeChatSection, content)}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
