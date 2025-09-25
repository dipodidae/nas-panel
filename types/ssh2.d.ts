/* eslint-disable */
declare module 'ssh2' {
  import { EventEmitter } from 'node:events'
  export interface ConnectConfig { host?: string; port?: number; username?: string; privateKey?: string | Buffer; readyTimeout?: number }
  export interface ClientChannel extends EventEmitter { stderr: ClientChannel }
  export class Client extends EventEmitter {
    connect(config: ConnectConfig): this
    exec(command: string, callback: (err: Error | undefined | null, channel: ClientChannel) => void): void
    end(): this
  }
}
