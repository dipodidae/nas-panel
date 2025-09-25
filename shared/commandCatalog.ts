// Shared SSR-safe command catalog: front-end consumes UI metadata; back-end validates keys.
// Types auto-imported globally from /types

export const COMMAND_META: CommandMeta[] = [
  {
    key: 'docker-restart',
    label: 'Restart Docker Compose',
    icon: 'i-lucide-refresh-ccw',
    confirm: true,
    description: 'Restarts all services defined in docker compose.',
  },
  {
    key: 'docker-ps',
    label: 'List Docker Containers',
    icon: 'i-lucide-list',
    confirm: false,
    description: 'Shows running docker containers.',
  },
  {
    key: 'host-reboot',
    label: 'Reboot Host',
    icon: 'i-lucide-power',
    confirm: true,
    description: 'Reboots the host machine.',
  },
]

export function listCommandMeta(): CommandMeta[] {
  return COMMAND_META
}

export function findCommandMeta(key: string): CommandMeta | undefined {
  return COMMAND_META.find(c => c.key === key)
}
