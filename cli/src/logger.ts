import chalk from 'chalk'

export type LogLevel = 'normal' | 'quiet'

let currentLogLevel: LogLevel = 'normal'

export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level
}

export const logger = {
  info: (msg: string) => {
    if (currentLogLevel === 'quiet') return
    console.log(chalk.blue('ℹ'), msg)
  },
  success: (msg: string) => console.log(chalk.green('✔'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✖'), msg),
  step: (msg: string) => {
    if (currentLogLevel === 'quiet') return
    console.log(chalk.cyan('▸'), msg)
  },
  raw: (msg: string) => {
    if (currentLogLevel === 'quiet') return
    console.log(msg)
  },
  newLine: () => {
    if (currentLogLevel === 'quiet') return
    console.log()
  },
}

export class Spinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  private index = 0
  private interval: NodeJS.Timeout | null = null
  private message: string

  constructor(message: string) {
    this.message = message
  }

  start(): void {
    if (currentLogLevel === 'quiet') return
    this.interval = setInterval(() => {
      process.stdout.write(`\r${chalk.cyan(this.frames[this.index])} ${this.message}`)
      this.index = (this.index + 1) % this.frames.length
    }, 80)
  }

  stop(finalMessage?: string): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      process.stdout.write('\r\x1b[K')
    }
    if (finalMessage) {
      logger.success(finalMessage)
    }
  }
}
