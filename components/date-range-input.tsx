import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangeInputProps {
  startYear?: string
  startMonth?: string
  endYear?: string
  endMonth?: string
  onChange?: (dates: { 
    startYear?: string
    startMonth?: string
    endYear?: string
    endMonth?: string
  }) => void
  showEndDate?: boolean
  showCurrentOption?: boolean
}

export function DateRangeInput({
  startYear,
  startMonth,
  endYear,
  endMonth,
  onChange,
  showEndDate = true,
  showCurrentOption = true
}: DateRangeInputProps) {
  const years = Array.from({ length: 10 }, (_, i) => 
    (new Date().getFullYear() - 5 + i).toString()
  )
  const months = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  )

  return (
    <div className="flex items-center gap-2">
      <Select
        value={startYear}
        onValueChange={(value) => 
          onChange?.({ startYear: value, startMonth, endYear, endMonth })
        }
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="年" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={startMonth}
        onValueChange={(value) => 
          onChange?.({ startYear, startMonth: value, endYear, endMonth })
        }
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="月" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}月
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showEndDate && (
        <>
          <span>〜</span>
          <Select
            value={endYear}
            onValueChange={(value) => 
              onChange?.({ startYear, startMonth, endYear: value, endMonth })
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="年" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}年
                </SelectItem>
              ))}
              {showCurrentOption && (
                <SelectItem value="current">現在</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select
            value={endMonth}
            onValueChange={(value) => 
              onChange?.({ startYear, startMonth, endYear, endMonth: value })
            }
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="月" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  )
}

