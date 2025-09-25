import type { CommandDefinition, SerializedCommandInstance, WhitelistedCommandConfig } from './commandTypes'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import process from 'node:process'
import { COMMAND_META } from '../../shared/commandCatalog'
import { COMMAND_BUFFER_MAX_LINES, COMMAND_ENV_HOME_FALLBACK } from './commandConstants'

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

export function startCommand(key: string): CommandDefinition {
  const def = COMMAND_WHITELIST[key]
  if (!def)
    throw new Error('Unknown command')

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

  const child = spawn(instance.command, instance.args, {
    cwd: instance.cwd,
    env: process.env,
    shell: false,
  })
  instance.proc = child

  child.stdout.on('data', d => recordProcessOutput(instance, 'stdout', d.toString()))
  child.stderr.on('data', d => recordProcessOutput(instance, 'stderr', d.toString()))
  child.on('error', (err) => {
    instance.status = 'error'
    recordProcessOutput(instance, 'meta', `ERROR: ${err.message}`)
  })
  child.on('close', (code) => {
    instance.status = 'exited'
    instance.exitCode = code
    recordProcessOutput(instance, 'meta', `EXIT ${code}`)
  })

  recordProcessOutput(instance, 'meta', `START ${instance.command} ${instance.args.join(' ')} (cwd=${instance.cwd})`)

  return instance
}

function recordProcessOutput(instance: CommandDefinition, kind: 'stdout' | 'stderr' | 'meta', data: string) {
  const serialized = JSON.stringify({ t: Date.now(), kind, data })
  instance.buffer.push(serialized)
  if (instance.buffer.length > COMMAND_BUFFER_MAX_LINES)
    instance.buffer.splice(0, instance.buffer.length - COMMAND_BUFFER_MAX_LINES)
  instance.emitter.emit('data', serialized)
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

// Future: add cancelCommand(id) to gracefully terminate running processes.
