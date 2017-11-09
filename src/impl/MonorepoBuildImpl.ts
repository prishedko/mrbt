import {assert, isInexact, log} from './Utils'
import * as path from 'path'
import * as fs from 'fs'
import chalk from 'chalk'
import {MonorepoBuildRunner} from './MonorepoBuildRunner'
import {ExecutionCallbacks, Executor, PackageExecutors} from '../api/CommonTypes'
import {MonorepoBuild} from '../api/Fluent'

export class MonorepoBuildImpl implements MonorepoBuild {
    private packageExecutors: PackageExecutors = {}
    private packagesDir: string

    constructor(private defaultExecutor: Executor | Executor[]) {
        assert(() => !isInexact(defaultExecutor), 'Executor cannot be null or undefined')
    }

    packages(dir: string): MonorepoBuild {
        assert(() => !isInexact(dir), 'Package directory cannot be null or undefined')
        this.packagesDir = dir
        return this
    }

    withExecutor(name: string | string[], executor: Executor | Executor[]): MonorepoBuild {
        assert(() => !isInexact(name), 'Package name cannot be null or undefined')
        assert(() => typeof name === 'string' || Array.isArray(name), 'Package names should be a string or an array')
        assert(() => !isInexact(executor), 'Executor cannot be null or undefined')
        if (Array.isArray(name)) {
            name.forEach(v => this.packageExecutors[v] = executor)
        } else {
            this.packageExecutors[name] = executor
        }
        return this
    }

    private doesDirectoryExist(directory: string): void {
        if (!fs.existsSync(directory)) {
            log.error(`Directory ${chalk.bold(directory)} doesn't exist`)
            throw new Error(`Directory ${directory} doesn't exist`)
        }
        if (!fs.lstatSync(directory).isDirectory()) {
            log.error(`Directory ${chalk.bold(directory)} is not a directory`)
            throw new Error(`Directory ${directory} is not a directory`)
        }
    }

    execute(callbacks?: ExecutionCallbacks): void {
        assert(() => !isInexact(this.defaultExecutor), 'Cannot build without default executor')
        if (!this.packagesDir) {
            this.packagesDir = path.resolve(path.join('.', 'packages'))
        } else {
            if (!path.isAbsolute(this.packagesDir)) {
                this.packagesDir = path.join(path.resolve('.'), this.packagesDir)
            }
        }
        this.doesDirectoryExist(this.packagesDir)
        Object.keys(this.packageExecutors).forEach(pkgName => {
            const pkgDir = path.join(this.packagesDir, pkgName)
            this.doesDirectoryExist(pkgDir)
            const packageJson = path.join(pkgDir, 'package.json')
            if (!fs.existsSync(packageJson)) {
                log.error(`Package directory ${chalk.bold(pkgDir)} doesn't contain ${chalk.bold('package.json')}`)
                throw new Error(`Package directory ${pkgDir} doesn't contain package.json`)
            }
            if (!fs.lstatSync(packageJson).isFile()) {
                log.error(`${chalk.bold(packageJson)} is not a file`)
                throw new Error(`${packageJson} is not a file`)
            }
        })
        const cbs = {
            onComplete: callbacks && callbacks.onComplete
                ? callbacks.onComplete
                : () => log.info(`Monorepo has been built successfully`),
            onError: callbacks && callbacks.onError
                ? callbacks.onError
                : (error: Error) => { throw error }
        }
        const runner = new MonorepoBuildRunner(this.defaultExecutor, this.packageExecutors, this.packagesDir, cbs)
        runner.run()
    }
}
