import {SpawnExecutor} from './SpawnExecutor'
import {assert, isInexact, log} from './Utils'
import chalk from 'chalk'
import {SpawnExecutorBuilder} from '../api/Fluent'
import {ExecutionContext, Executor, IndexedStrings, SpawnExecutorOptions} from '../api/CommonTypes'

export class SpawnExecutorBuilderImpl implements SpawnExecutorBuilder {
    private filtr: (context: ExecutionContext) => boolean = () => true
    private args: string[] = []
    private opts: SpawnExecutorOptions = {}

    constructor(private command: string, private extensions: IndexedStrings = {}) {
        assert(() => !isInexact(command), 'Command cannot not be null or undefined')
    }

    filter(predicate: (context: ExecutionContext) => boolean): SpawnExecutorBuilder {
        if (isInexact(predicate)) {
            log.warn(`${chalk.bold('filter')} cannot be null or undefined, will be ignored`)
        } else {
            this.filtr = predicate
        }
        return this
    }

    arg(argument: string): SpawnExecutorBuilder {
        if (isInexact(argument)) {
            log.warn(`${chalk.bold('arg')} cannot be null or undefined, will be ignored`)
        } else {
            this.args.push(argument)
        }
        return this
    }

    options(opts: SpawnExecutorOptions): SpawnExecutorBuilder {
        if (isInexact(opts)) {
            log.warn(`${chalk.bold('options')} cannot be null or undefined, will be ignored`)
        } else {
            this.opts = {
                ...this.opts,
                ...opts
            }
        }
        return this
    }

    build(): Executor {
        return new SpawnExecutor(this.command, this.extensions, this.filtr, this.args, this.opts)
    }
}
