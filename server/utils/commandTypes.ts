import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type { EventEmitter } from 'node:events'

export type CommandRuntimeStatus = 'running' | 'exited' | 'error'

export interface CommandDefinition {
  id: string
  key: string
  command: string
  args: string[]
  cwd: string
  createdAt: number
  status: CommandRuntimeStatus
  exitCode?: number | null
  buffer: string[] // rolling buffer of serialized line objects
  proc?: ChildProcessWithoutNullStreams
  emitter: EventEmitter
}

export interface WhitelistedCommandConfig {
  cmd: string
  args?: string[]
  cwd?: string
}

export interface SerializedCommandInstance {
  id: string
  key: string
  status: CommandRuntimeStatus
  exitCode: number | null
  createdAt: number
}
