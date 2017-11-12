import * as child from 'child_process'
import {log} from './Utils'
import chalk from 'chalk'
import {ExecutionCallbacks, ExecutionContext, Executor, ForkExecutorOptions} from '../api/CommonTypes'

export class ForkExecutor implements Executor {
    constructor(private modulePath: string,
                private filter: (context: ExecutionContext) => boolean,
                private args: string[],
                private options: ForkExecutorOptions) {}

    execute(options: ForkExecutorOptions, callbacks?: ExecutionCallbacks): void {
        const cbs = {
            onComplete: callbacks && callbacks.onComplete
                ? callbacks.onComplete
                : () => log.info(`Node script ${chalk.bold(this.modulePath)} completed successfully`),
            onError: callbacks && callbacks.onError
                ? callbacks.onError
                : (error: Error) => { throw error }
        }
        if (!this.filter({ platform: process.platform })) {
            log.warn(`Execution of node script ${chalk.bold(this.modulePath)} was filtered`)
            cbs.onComplete()
            return
        }
        const opts: ForkExecutorOptions = {
            ...options,
            ...this.options
        }
        const childProcess = child.fork(this.modulePath, this.args, opts)
        childProcess.on('error', error => {
            log.error(`Node script ${chalk.bold(this.modulePath)} failed with error: ${error}`)
            cbs.onError(new Error(`Node script ${this.modulePath} failed with error: ${error}`))
        })
        childProcess.on('exit', code => {
            if (code === 0) {
                cbs.onComplete()
            } else {
                log.error(`Node script ${chalk.bold(this.modulePath)} exited with code ${code}`)
                cbs.onError(new Error(`Node script ${this.modulePath} exited with code ${code}`))
            }
        })
    }
}
