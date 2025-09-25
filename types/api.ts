import type { CommandMeta, SerializedCommandInstance } from './command'

export interface ListCommandsResponse {
  ok: boolean
  commands: CommandMeta[]
}

export interface StartCommandResponse {
  ok: boolean
  command: SerializedCommandInstance
  wsPath: string
}

export interface GenericOkResponse { ok: boolean }
