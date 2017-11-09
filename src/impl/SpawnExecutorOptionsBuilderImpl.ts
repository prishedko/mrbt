import {isInexact, log} from './Utils'
import chalk from 'chalk'
import {SpawnExecutorOptionsBuilder} from '../api/Fluent'
import {SpawnExecutorOptions, StdOption} from '../api/CommonTypes'

export class SpawnExecutorOptionsBuilderImpl implements SpawnExecutorOptionsBuilder {
    private options: SpawnExecutorOptions = {}

    cwd(value: string): SpawnExecutorOptionsBuilder {
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

    env(value: Object): SpawnExecutorOptionsBuilder {
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

    argv0(value: string): SpawnExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('argv0')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                argv0: value
            }
        }
        return this
    }

    stdio(value: StdOption[] | string): SpawnExecutorOptionsBuilder {
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

    detached(value: boolean): SpawnExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('detached')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                detached: value
            }
        }
        return this
    }

    uid(value: number): SpawnExecutorOptionsBuilder {
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

    gid(value: number): SpawnExecutorOptionsBuilder {
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

    shell(value: boolean | string): SpawnExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('shell')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                shell: value
            }
        }
        return this

    }

    windowsHide(value: boolean): SpawnExecutorOptionsBuilder {
        if (isInexact(value)) {
            log.warn(`${chalk.bold('windowsHide')} cannot be null or undefined, will be ignored`)
        } else {
            this.options = {
                ...this.options,
                windowsHide: value
            }
        }
        return this

    }

    build(): SpawnExecutorOptions {
        return {...this.options}
    }

}
