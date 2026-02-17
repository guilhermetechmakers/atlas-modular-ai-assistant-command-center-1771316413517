import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsGithubApi } from '@/api/projects-github'
import { toast } from 'sonner'
import type { ProjectsGitHubRecord, CreateIssuePayload } from '@/types/projects-github'

export const projectsGithubKeys = {
  all: ['projects-github'] as const,
  lists: () => [...projectsGithubKeys.all, 'list'] as const,
  list: (status?: string) => [...projectsGithubKeys.lists(), status] as const,
  details: () => [...projectsGithubKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsGithubKeys.details(), id] as const,
  repos: () => [...projectsGithubKeys.all, 'repos'] as const,
  activity: (repo?: string) => [...projectsGithubKeys.all, 'activity', repo] as const,
  issues: (repo: string, params?: { state?: string; search?: string }) =>
    [...projectsGithubKeys.all, 'issues', repo, params] as const,
  milestones: (repo?: string) => [...projectsGithubKeys.all, 'milestones', repo] as const,
}

export function useProjectsGitHubRecords(status?: string) {
  return useQuery({
    queryKey: projectsGithubKeys.list(status),
    queryFn: () => projectsGithubApi.list(),
    placeholderData: [],
    select: (list) =>
      status ? list.filter((p) => p.status === status) : list,
  })
}

export function useProjectsGitHubRepos() {
  return useQuery({
    queryKey: projectsGithubKeys.repos(),
    queryFn: () => projectsGithubApi.repos(),
    placeholderData: [],
  })
}

export function useProjectsGitHubActivity(repo?: string) {
  return useQuery({
    queryKey: projectsGithubKeys.activity(repo),
    queryFn: () => projectsGithubApi.activity(repo),
    placeholderData: [],
  })
}

export function useProjectsGitHubIssues(
  repo: string,
  params?: { state?: 'open' | 'closed'; search?: string }
) {
  return useQuery({
    queryKey: projectsGithubKeys.issues(repo, params),
    queryFn: () => projectsGithubApi.issues(repo, params),
    enabled: !!repo,
    placeholderData: [],
  })
}

export function useProjectsGitHubMilestones(repo?: string) {
  return useQuery({
    queryKey: projectsGithubKeys.milestones(repo),
    queryFn: () => projectsGithubApi.milestones(repo),
    placeholderData: [],
  })
}

export function useCreateProjectsGitHubRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<ProjectsGitHubRecord, 'title' | 'description' | 'status'>) =>
      projectsGithubApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsGithubKeys.lists() })
      toast.success('Project saved')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save project')
    },
  })
}

export function useCreateGitHubIssue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => projectsGithubApi.createIssue(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectsGithubKeys.issues(variables.repo) })
      queryClient.invalidateQueries({ queryKey: projectsGithubKeys.activity() })
      toast.success('Issue created')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create issue')
    },
  })
}
