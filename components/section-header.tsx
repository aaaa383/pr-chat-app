import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { InfoIcon as InfoCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

interface SectionHeaderProps {
  title: string
  required?: boolean
  isDraft?: boolean
  onDraftChange?: (checked: boolean) => void
  tooltip?: string
}

export function SectionHeader({ 
  title, 
  required, 
  isDraft, 
  onDraftChange,
  tooltip 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {title}
          {required && (
            <span className="bg-orange-500 text-white rounded-full p-1 ml-2 text-xs">
              ★
            </span>
          )}
        </h2>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {typeof isDraft !== 'undefined' && (
        <div className="flex items-center gap-2">
          <Label htmlFor={`draft-${title}`}>下書き：</Label>
          <Switch
            id={`draft-${title}`}
            checked={isDraft}
            onCheckedChange={onDraftChange}
          />
        </div>
      )}
    </div>
  )
}

