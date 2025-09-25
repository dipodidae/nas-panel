// Uses global types from /types (CommandDefinition, SerializedCommandInstance, WhitelistedCommandConfig)
import { randomUUID } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import process from 'node:process'
import { COMMAND_META } from '#shared/commandCatalog'
import { COMMAND_BUFFER_MAX_LINES, COMMAND_ENV_HOME_FALLBACK } from './commandConstants'
import { execRemote } from './sshExec'

// Whitelisted commands (execution mapping). Keep in sync with front-end catalog but do NOT expose
// sensitive args in catalog if that ever becomes a concern.
const COMMAND_WHITELIST: Record<string, WhitelistedCommandConfig> = {
  'docker-restart': {
    cmd: 'docker',
    args: ['compose', 'restart'],
    cwd: process.env.NAS_HOME || join(process.env.HOME || '/', COMMAND_ENV_HOME_FALLBACK),
  },
  'docker-ps': { cmd: 'docker', args: ['ps'] },
  'host-reboot': { cmd: '/sbin/reboot', args: [] },
}

// Registry of active/executed command instances
const instances = new Map<string, CommandDefinition>()

export function listCommands(): string[] {
  // Filter by meta catalog to ensure we only list commands that are intended for UI
  return COMMAND_META.map(m => m.key).filter(k => k in COMMAND_WHITELIST)
}

export function getCommand(id: string): CommandDefinition | undefined {
  return instances.get(id)
}

export function cancelCommand(id: string): boolean {
  const inst = instances.get(id)
  if (!inst)
    return false
  if (inst.status !== 'running' || !inst.proc)
    return false
  try {
    inst.proc.kill('SIGTERM')
    recordProcessOutput(inst, 'meta', 'CANCEL REQUESTED')
    return true
  }
  catch (e: any) {
    recordProcessOutput(inst, 'meta', `CANCEL ERROR: ${e.message}`)
    return false
  }
}

export function startCommand(key: string): CommandDefinition {
  const def = resolveWhitelistedDefinition(key)
  const instance = createInstance(key, def)
  launchRemote(instance)
  return instance
}

function resolveWhitelistedDefinition(key: string): WhitelistedCommandConfig {
  const def = COMMAND_WHITELIST[key]
  if (!def)
    throw new Error('Unknown command')
  return def
}

function createInstance(key: string, def: WhitelistedCommandConfig): CommandDefinition {
  const id = randomUUID()
  const instance: CommandDefinition = {
    id,
    key,
    command: def.cmd,
    args: def.args || [],
    cwd: def.cwd || process.cwd(),
    createdAt: Date.now(),
    status: 'running',
    buffer: [],
    emitter: new EventEmitter(),
  }
  instances.set(id, instance)
  return instance
}

function launchRemote(instance: CommandDefinition) {
  const full = `${instance.command} ${instance.args.join(' ')}`.trim()
  recordProcessOutput(instance, 'meta', `START ${full}`)
  try {
    void execRemote(full, buildRemoteHandlers(instance))
  }
  catch (e: any) {
    instance.status = 'error'
    recordProcessOutput(instance, 'meta', `ERROR: ${e.message}`)
  }
}

function buildRemoteHandlers(instance: CommandDefinition) {
  return {
    onStdout: (data: string) => recordProcessOutput(instance, 'stdout', data),
    onStderr: (data: string) => recordProcessOutput(instance, 'stderr', data),
    onExit: (code: number | null) => {
      instance.status = 'exited'
      instance.exitCode = code
      recordProcessOutput(instance, 'meta', `EXIT ${code}`)
    },
    onError: (err: Error) => {
      instance.status = 'error'
      recordProcessOutput(instance, 'meta', `ERROR: ${err.message}`)
    },
  }
}

function recordProcessOutput(instance: CommandDefinition, kind: 'stdout' | 'stderr' | 'meta', data: string) {
  const serialized = JSON.stringify({ t: Date.now(), kind, data })
  instance.buffer.push(serialized)
  trimBuffer(instance)
  instance.emitter.emit('data', serialized)
}

function trimBuffer(instance: CommandDefinition) {
  if (instance.buffer.length > COMMAND_BUFFER_MAX_LINES)
    instance.buffer.splice(0, instance.buffer.length - COMMAND_BUFFER_MAX_LINES)
}

export function serializeInstance(inst: CommandDefinition): SerializedCommandInstance {
  return {
    id: inst.id,
    key: inst.key,
    status: inst.status,
    exitCode: inst.exitCode ?? null,
    createdAt: inst.createdAt,
  }
}

// cancelCommand implemented above (SIGTERM); could add SIGKILL fallback after timeout.
