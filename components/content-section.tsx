"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Wand2 } from 'lucide-react'
import { DateRangeInput } from './date-range-input'
import { SectionHeader } from './section-header'

interface ContentSectionProps {
  title: string
  required?: boolean
  showTitle?: boolean
  showDates?: boolean
  showImageUpload?: boolean
  templateText?: string
  placeholder?: string
  tooltip?: string
  maxLength?: number
  onAIGeneration?: () => void
}

export function ContentSection({
  title,
  required,
  showTitle = true,
  showDates = false,
  showImageUpload = false,
  templateText,
  placeholder,
  tooltip,
  maxLength = 1000,
  onAIGeneration
}: ContentSectionProps) {
  const [isDraft, setIsDraft] = useState(false)
  const [content, setContent] = useState('')
  const [titleText, setTitleText] = useState('')

  const handleUseTemplate = () => {
    setContent(templateText || '')
  }

  const handleContentGenerated = (generatedContent: string) => {
    setContent(generatedContent)
  }

  return (
    <div className="space-y-4 py-6 border-b border-gray-200 last:border-0">
      <SectionHeader
        title={title}
        required={required}
        isDraft={isDraft}
        onDraftChange={setIsDraft}
        tooltip={tooltip}
      />

      {showTitle && (
        <Input
          placeholder="タイトルを入力"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
        />
      )}

      {showDates && (
        <DateRangeInput />
      )}

      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleUseTemplate}
        >
          テンプレートを使う
        </Button>
        <Button 
          type="button" 
          variant="outline"
        >
          記入例を見る
        </Button>
        {onAIGeneration && (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => onAIGeneration()}
          >
            <Wand2 className="w-4 h-4" />
            AIで自動生成
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px]"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>300文字以上入力すると、オファーを獲得しやすくなります。</span>
          <span>{content.length} / {maxLength} 文字</span>
        </div>
      </div>

      {showImageUpload && (
        <Button type="button" variant="outline" className="gap-2">
          <ImagePlus className="w-4 h-4" />
          写真を追加
        </Button>
      )}
    </div>
  )
}

