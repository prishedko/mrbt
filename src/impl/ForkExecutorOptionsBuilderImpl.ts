import {isInexact, log} from './Utils'
import chalk from 'chalk'
import {ForkExecutorOptionsBuilder} from '../api/Fluent'
import {ForkExecutorOptions, StdOption} from '../api/CommonTypes'

export class ForkExecutorOptionsBuilderImpl implements ForkExecutorOptionsBuilder {
    private options: ForkExecutorOptions = {}

    cwd(value: string): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('cwd')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                cwd: value
            }
        }
        return this

    }

    env(value: Object): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('env')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                env: value
            }
        }
        return this
    }

    stdio(value: StdOption[] | string): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('stdio')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                stdio: value
            }
        }
        return this
    }

    uid(value: number): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('uid')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                uid: value
            }
        }
        return this
    }

    gid(value: number): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('gid')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                gid: value
            }
        }
        return this
    }

    execPath(value: string): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('execPath')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                execPath: value
            }
        }
        return this
    }

    execArgv(value: string[]): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('execArgv')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                execArgv: value
            }
        }
        return this
    }

    silent(value: boolean): ForkExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('silent')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                silent: value
            }
        }
        return this
    }

    build(): ForkExecutorOptions {
        return {...this.options}
    }
}
