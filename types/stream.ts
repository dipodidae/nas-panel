// Streaming / terminal view related types
import type { CommandRuntimeStatus } from './command'

export interface ParsedLine {
  ts: number
  kind: 'stdout' | 'stderr' | 'meta'
  text: string
}

export interface CommandStreamState {
  lines: ParsedLine[]
  status: CommandRuntimeStatus | 'idle' | 'connecting' | 'streaming' | 'closed' | 'error'
  error: string | null
  exitCode: number | null
  activeId: string | null
  follow: boolean
  cancelling: boolean
}
