import { useState } from 'react'
import { ListTodo, Plus, Check, Circle, Repeat, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus, RecurrenceRule } from '@/types/personal-calendar-travel'

export interface TaskListRoutinesProps {
  tasks: Task[]
  isLoading?: boolean
  onAddTask?: (task: Pick<Task, 'title' | 'dueAt' | 'recurrence'>) => void
  onToggleTask?: (id: string, status: TaskStatus) => void
  onDeleteTask?: (id: string) => void
}

const RECURRENCE_LABELS: Record<RecurrenceRule, string> = {
  none: 'Once',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

export function TaskListRoutines({
  tasks,
  isLoading = false,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListRoutinesProps) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onAddTask?.({
      title: t,
      dueAt: dueAt.trim() || undefined,
      recurrence,
    })
    setTitle('')
    setDueAt('')
    setRecurrence('none')
    setShowForm(false)
  }

  const todoTasks = tasks.filter((t) => t.status !== 'done')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Tasks & routines
          </CardTitle>
          <CardDescription>Simple task manager with recurring tasks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Tasks & routines
          </CardTitle>
          <CardDescription>Simple task manager with recurring tasks.</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="transition-transform duration-200 hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add task
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card-secondary/50 p-4 space-y-3 animate-fade-in"
          >
            <div className="space-y-2">
              <Label htmlFor="task-title">Task</Label>
              <Input
                id="task-title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="task-due">Due date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Recurrence</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}
                >
                  {(Object.keys(RECURRENCE_LABELS) as RecurrenceRule[]).map((r) => (
                    <option key={r} value={r}>
                      {RECURRENCE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Add
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-8 text-center">
              <ListTodo className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No tasks yet.</p>
              <p className="text-xs text-muted-foreground">Add a task or routine to get started.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add first task
              </Button>
            </div>
          ) : (
            <>
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card-secondary/50 px-3 py-2.5 transition-all duration-200 hover:shadow-card group"
                >
                  <button
                    type="button"
                    onClick={() => onToggleTask?.(task.id, 'done')}
                    className="rounded-full p-0.5 text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Mark "${task.title}" done`}
                  >
                    <Circle className="h-5 w-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground">{task.title}</span>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {task.dueAt && (
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(task.dueAt).toLocaleDateString()}
                        </span>
                      )}
                      {task.recurrence && task.recurrence !== 'none' && (
                        <Badge variant="secondary" className="text-xs gap-0.5">
                          <Repeat className="h-3 w-3" />
                          {RECURRENCE_LABELS[task.recurrence]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteTask?.(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {doneTasks.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Completed</p>
                  {doneTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 opacity-80"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask?.(task.id, 'todo')}
                        className="rounded-full p-0.5 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Mark "${task.title}" not done`}
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <span className="flex-1 text-sm text-muted-foreground line-through">
                        {task.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteTask?.(task.id)}
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
