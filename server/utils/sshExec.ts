/// <reference path='../../types/ssh2.d.ts' />
import type { Buffer } from 'node:buffer'
import type { ClientChannel } from 'ssh2'
import { Client } from 'ssh2'
import { decryptPrivateKey } from './sshCrypto'
import { getSshInternal } from './sshSettings'

interface ExecResultHandlers {
  onStdout: (data: string) => void
  onStderr: (data: string) => void
  onExit: (code: number | null) => void
  onError: (err: Error) => void
}

export function execRemote(command: string, handlers: ExecResultHandlers) {
  const cfg = getSshInternal()
  if (!cfg.host || !cfg.username || !cfg.encryptedPrivateKey)
    throw new Error('SSH not configured')
  const privateKey = decryptPrivateKey(cfg.encryptedPrivateKey)
  const conn = new Client()
  conn.on('ready', () => {
    conn.exec(command, (err: Error | undefined | null, stream: ClientChannel) => {
      if (err) {
        handlers.onError(err)
        conn.end()
        return
      }
      stream.on('data', (d: Buffer) => handlers.onStdout(d.toString()))
      stream.stderr.on('data', (d: Buffer) => handlers.onStderr(d.toString()))
      stream.on('close', (code: number) => {
        handlers.onExit(code)
        conn.end()
      })
    })
  })
  conn.on('error', (e: Error) => handlers.onError(e))
  conn.connect({
    host: cfg.host,
    username: cfg.username!,
    privateKey,
    readyTimeout: 10000,
  })
}

export function testRemoteConnection(): Promise<{ success: boolean, message: string, latencyMs?: number }> {
  return new Promise((resolve) => {
    const start = Date.now()
    try {
      execRemote('echo ok', {
        onStdout: () => {},
        onStderr: () => {},
        onExit: (code) => {
          resolve({ success: code === 0, message: code === 0 ? 'ok' : `exit ${code}`, latencyMs: Date.now() - start })
        },
        onError: (err) => {
          resolve({ success: false, message: err.message })
        },
      })
    }
    catch (e: any) {
      resolve({ success: false, message: e.message })
    }
  })
}
