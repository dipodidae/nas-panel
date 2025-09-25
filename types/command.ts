// Central command-related types shared across client & server
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type { EventEmitter } from 'node:events'

export type CommandRuntimeStatus = 'running' | 'exited' | 'error'

// Metadata exposed to UI (shared with catalog)
export interface CommandMeta {
  key: string
  label: string
  icon?: string
  confirm?: boolean
  description?: string
}

export interface WhitelistedCommandConfig {
  cmd: string
  args?: string[]
  cwd?: string
}

export interface CommandDefinition {
  id: string
  key: string
  command: string
  args: string[]
  cwd: string
  createdAt: number
  status: CommandRuntimeStatus
  exitCode?: number | null
  buffer: string[]
  proc?: ChildProcessWithoutNullStreams
  emitter: EventEmitter
  cancelTimer?: NodeJS.Timeout
}

export interface SerializedCommandInstance {
  id: string
  key: string
  status: CommandRuntimeStatus
  exitCode: number | null
  createdAt: number
}

export interface CommandHistoryEntry {
  id: string
  key: string
  exitCode: number | null
  at: number
}
