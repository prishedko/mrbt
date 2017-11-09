import chalk from 'chalk'
import {Chalk} from 'chalk'

export interface Indexed<T> {
    [key: string]: T
}

export function isInexact(value: any): boolean {
    return value === undefined || value === null
}

export function assert(predicate: () => boolean, message: string, action?: () => void, logger?: Chalk): void {
    if (!predicate()) {
        log.error(message, logger)
        if (action) {
            action()
        } else {
            throw new Error(`Assertion error: ${message}`)
        }
    }
}

export function noop(..._: any[]): void {
    // do nothing
}

export function isWin(platform: string = process.platform): boolean {
    return /^win/.test(platform)
}

export namespace log {

    function prefix(logger: Chalk): string {
        return logger.bold('[mrbt]')
    }

    export function error(message: string, logger: Chalk = chalk.red): void {
        console.error(logger(prefix(logger), message))
    }

    export function warn(message: string, logger: Chalk = chalk.yellow): void {
        console.warn(logger(prefix(logger), message))
    }

    export function info(message: string, logger: Chalk = chalk.green): void {
        console.info(logger(prefix(logger), message))
    }
}
