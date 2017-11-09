import {assert, Indexed, isInexact, log} from './Utils'
import {GraphsAPI, GraphsBuilders} from 'algorithms-ts'

import Digraph = GraphsAPI.Digraph
import * as fs from 'fs'
import * as path from 'path'
import digraph = GraphsBuilders.digraph
import vertex = GraphsBuilders.vertex
import directedCycle = GraphsBuilders.directedCycle
import topologicalOrder = GraphsBuilders.topologicalOrder
import {ExecutionCallbacks, Executor, PackageExecutors} from '../api/CommonTypes'

type DependencyInfo = Indexed<string>

type PackageInfo = {
    name: string
    directory: string
    dependencies: DependencyInfo
    executors: Executor[]
}

type Packages = Indexed<PackageInfo>

export class MonorepoBuildRunner {

    constructor(private defaultExecutor: Executor | Executor[],
                private packageExecutors: PackageExecutors,
                private packagesDir: string,
                private callback: ExecutionCallbacks) {
    }

    private wrapExecutors(executor: Executor | Executor[]): Executor[] {
        assert(() => !isInexact(executor), 'Executor cannot be null or undefined')
        if (Array.isArray(executor)) {
            return [...executor]
        } else {
            return [executor]
        }
    }

    private getExecutors(packageName: string): Executor[] {
        const packageExecutors = this.packageExecutors[packageName]
        if (packageExecutors) {
            return this.wrapExecutors(packageExecutors)
        } else {
            return this.wrapExecutors(this.defaultExecutor)
        }
    }

    private collectPackages(): Packages {
        const packageDirNames: string[] = fs.readdirSync(this.packagesDir)
            .filter(dir => fs.existsSync(path.join(this.packagesDir, path.basename(dir), 'package.json')))
            .map(dir => path.basename(dir))
        return packageDirNames.reduce((acc: Packages, packageDir: string) => {
            const packageJson = require([this.packagesDir, packageDir, 'package.json'].join('/'))
            acc[packageJson.name] = {
                name: packageJson.name,
                directory: path.join(this.packagesDir, packageDir),
                dependencies: {
                    ...(packageJson.dependencies ? packageJson.dependencies : {}),
                    ...(packageJson.devDependencies ? packageJson.devDependencies : {})
                },
                executors: this.getExecutors(packageJson.name)
            }
            return acc
        }, {})
    }

    private buildReversedDependenciesGraph(): Digraph<PackageInfo> {
        const packages = this.collectPackages()
        const depDAG = Object.keys(packages).reduce((acc, packageName) => {
            const v = packages[packageName]
            acc.addVertex(vertex(v.name, v))
            Object.keys(v.dependencies).filter(dependencyName => dependencyName in packages).forEach(dependencyName => {
                const w = packages[dependencyName]
                acc.addEdge(vertex(v.name, v), vertex(w.name, w))
            })
            return acc
        }, digraph<PackageInfo>())
        return depDAG.reverse()
    }

    private buildPackage(packageToBuild: PackageInfo, restPackages: PackageInfo[]): void {
        if (packageToBuild.executors.length === 0) {
            this.buildPackages(restPackages)
        } else {
            const [currentExecutor, ...rest] = packageToBuild.executors
            currentExecutor.execute(
                {
                    cwd: packageToBuild.directory,
                    env: process.env
                },
                {
                    onComplete: () => {
                        this.buildPackage({
                            ...packageToBuild,
                            executors: rest
                        }, restPackages)
                    },
                    onError: error => {
                        if (this.callback.onError) {
                            this.callback.onError(error)
                        } else {
                            log.error(`Build of package ${packageToBuild.name} failed with error: ${error}`)
                            throw error
                        }
                    }
                })
        }
    }

    private buildPackages(packages: PackageInfo[]): void {
        if (packages.length === 0) {
            if (this.callback.onComplete) {
                this.callback.onComplete()
            } else {
                log.info(`Build completed successfully`)
            }
        } else {
            const [packageToBuild, ...rest] = packages
            this.buildPackage(packageToBuild, rest)
        }
    }

    run(): void {
        const dag = this.buildReversedDependenciesGraph()
        const cycle = directedCycle(dag)
        assert(() => !cycle.hasCycle(), `There is a cycle between packages:
            ${cycle.cycle().reduce((acc, v) => acc === '' ? v.key : acc + '->' + v.key, '')}`)
        const ts = topologicalOrder(dag).order()
        this.buildPackages(ts.reduce((acc, v) => {
            acc.push(v.value)
            return acc
        }, [] as PackageInfo[]))
    }
}
