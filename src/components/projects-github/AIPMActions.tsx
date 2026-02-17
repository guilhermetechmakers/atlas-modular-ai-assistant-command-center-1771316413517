/**
 * AI PM Actions – 'Summarize recent activity', 'Create issues from goal' buttons.
 */
import { Bot, FileText, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface AIPMActionsProps {
  onSummarizeActivity?: () => void
  onCreateIssuesFromGoal?: () => void
  isSummarizing?: boolean
  isCreating?: boolean
}

export function AIPMActions({
  onSummarizeActivity,
  onCreateIssuesFromGoal,
  isSummarizing = false,
  isCreating = false,
}: AIPMActionsProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5 text-primary" />
          AI PM actions
        </CardTitle>
        <CardDescription>
          Summarize recent activity or create issues from a goal. Connect backend for full AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'w-full justify-start transition-transform duration-200 hover:scale-[1.02]',
            'focus-visible:ring-2 focus-visible:ring-ring'
          )}
          onClick={onSummarizeActivity}
          disabled={isSummarizing}
          aria-label="Summarize recent activity"
        >
          <FileText className="mr-2 h-4 w-4 shrink-0" />
          {isSummarizing ? 'Summarizing…' : 'Summarize recent activity'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'w-full justify-start transition-transform duration-200 hover:scale-[1.02]',
            'focus-visible:ring-2 focus-visible:ring-ring'
          )}
          onClick={onCreateIssuesFromGoal}
          disabled={isCreating}
          aria-label="Create issues from goal"
        >
          <Target className="mr-2 h-4 w-4 shrink-0" />
          {isCreating ? 'Creating…' : 'Create issues from goal'}
        </Button>
      </CardContent>
    </Card>
  )
}
