import * as child from 'child_process'
import chalk from 'chalk'
import {log} from './Utils'
import {ExecutionCallbacks, ExecutionContext, Executor, IndexedStrings, SpawnExecutorOptions} from '../api/CommonTypes'

export class SpawnExecutor implements Executor {
    constructor(private command: string,
                private extensions: IndexedStrings,
                private filter: (context: ExecutionContext) => boolean,
                private args: string[],
                private options: SpawnExecutorOptions) {}

    execute(options: SpawnExecutorOptions, callbacks?: ExecutionCallbacks): void {
        if (!this.filter({ platform: process.platform })) {
            log.info(`Execution of command ${chalk.bold(this.command)} was filtered`)
            return
        }
        const cbs = {
            onComplete: callbacks && callbacks.onComplete
                ? callbacks.onComplete
                : () => log.info(`Command ${chalk.bold(this.command)} completed successfully`),
            onError: callbacks && callbacks.onError
                ? callbacks.onError
                : (error: Error) => { throw error }
        }
        const opts: SpawnExecutorOptions = {
            ...options,
            ...this.options
        }
        const ext = this.extensions[process.platform]
        const cmd = ext ? `${this.command}.${ext}` : this.command
        const childProcess = child.spawn(cmd, this.args, opts)
        if (opts.stdio !== 'inherit') {
            if (childProcess.stdout && childProcess.stdout.on) {
                childProcess.stdout.on('data', data => {
                    process.stdout.write(data)
                })
            }
            if (childProcess.stderr && childProcess.stderr.on) {
                childProcess.stderr.on('data', data => {
                    process.stderr.write(data)
                })
            }
        }
        childProcess.on('error', error => {
            log.error(`Command ${chalk.bold(this.command)} failed with error: ${error}`)
            cbs.onError(new Error(`Command ${this.command} failed with error: ${error}`))
        })
        childProcess.on('exit', code => {
            if (code !== 0) {
                log.error(`Command ${chalk.bold(this.command)} exited with code ${code}`)
                cbs.onError(new Error(`Command ${this.command} exited with code ${code}`))
            }
            cbs.onComplete()
        })
    }
}
