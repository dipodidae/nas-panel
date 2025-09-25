import type { CommandHistoryEntry } from './command'

export interface CommandState {
  commandKey: string | null
  activeCommandId: string | null
  lastError: string | null
  pending: Record<string, boolean>
  history: CommandHistoryEntry[]
}
