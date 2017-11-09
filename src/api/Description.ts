import {ExecutionCallbacks, ExecutionContext, ExecutorOptions, IndexedStrings} from './CommonTypes'

export enum ExecutorType {
    shell = 'shell',
    binary = 'binary',
    node = 'node',
    npm = 'npm',
    yarn = 'yarn',
    mvn = 'mvn',
    gulp = 'gulp',
    webpack = 'webpack'
}

export interface ExecutorDescriptor {
    readonly type: ExecutorType
    readonly command?: string
    readonly modulePath?: string
    readonly extensions?: IndexedStrings
    readonly filter?: (context: ExecutionContext) => boolean
    readonly args?: string[]
    readonly options?: ExecutorOptions
}

export interface PackageExecutorDescription {
    package: string | string[]
    executor: ExecutorDescriptor | ExecutorDescriptor[]
}

export interface MonorepoBuildDescription {
    defaultExecutor: ExecutorDescriptor | ExecutorDescriptor[]
    packagesDir?: string
    packageExecutors?: PackageExecutorDescription[]
    callbacks?: ExecutionCallbacks
}
