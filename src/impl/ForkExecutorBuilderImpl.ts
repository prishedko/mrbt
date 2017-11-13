import chalk from 'chalk'
import {isInexact, log} from './Utils'
import {ForkExecutor} from './ForkExecutor'
import {ForkExecutorBuilder} from '../api/Fluent'
import {ExecutionContext, Executor, ForkExecutorOptions} from '../api/CommonTypes'
import {addMrbtCommandLineArgs} from './CommandLineArgsHelper'

export class ForkExecutorBuilderImpl implements ForkExecutorBuilder {
    private filtr: (context: ExecutionContext) => boolean = () => true
    private argumentsValues: string[] = []
    private opts: ForkExecutorOptions = {}

    constructor(private modulePath: string) {}

    filter(predicate: (context: ExecutionContext) => boolean): ForkExecutorBuilder {
        if (isInexact(predicate)) {
            log.warn(`${chalk.bold('filter')} cannot be null or undefined, will be ignored`)
        } else {
            this.filtr = predicate
        }
        return this
    }

    arg(argument: string): ForkExecutorBuilder {
        if (isInexact(argument)) {
            log.warn(`${chalk.bold('arg')} cannot be null or undefined, will be ignored`)
        } else {
            this.argumentsValues.push(argument)
        }
        return this
    }

    args(values: string[]): ForkExecutorBuilder {
        if (isInexact(values)) {
            log.warn(`${chalk.bold('args')} cannot be null or undefined, will be ignored`)
        } else if (!Array.isArray(values)) {
            log.warn(`${chalk.bold('args')} should be an array, will be ignored`)
        } else {
            values.forEach(v => this.arg(v))
        }
        return this
    }

    options(opts: ForkExecutorOptions): ForkExecutorBuilder {
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
        return new ForkExecutor(this.modulePath, this.filtr, addMrbtCommandLineArgs(this.modulePath,
            this.argumentsValues), this.opts)
    }

}
