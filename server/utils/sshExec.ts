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

export async function execRemote(command: string, handlers: ExecResultHandlers) {
  const { host, username, encryptedPrivateKey } = await getSshInternal()
  if (!host || !username || !encryptedPrivateKey)
    throw new Error('SSH not configured')
  const privateKey = decryptPrivateKey(encryptedPrivateKey)
  const conn = new Client()
  attachConnectionEvents(conn, command, handlers)
  conn.connect(buildConnectionConfig(host, username, privateKey))
}

function buildConnectionConfig(host: string, username: string, privateKey: string) {
  return { host, username, privateKey, readyTimeout: 10000 }
}

function attachConnectionEvents(conn: Client, command: string, handlers: ExecResultHandlers) {
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
}

export async function testRemoteConnection(): Promise<{ success: boolean, message: string, latencyMs?: number }> {
  return await new Promise((resolve) => {
    const start = Date.now()
    void execRemote('echo ok', {
      onStdout: noop,
      onStderr: noop,
      onExit: code => resolve({ success: code === 0, message: code === 0 ? 'ok' : `exit ${code}`, latencyMs: Date.now() - start }),
      onError: err => resolve({ success: false, message: err.message }),
    })
  })
}

function noop() {}
