import {
    ExecutionCallbacks,
    ExecutionContext, Executor, ForkExecutorOptions, IndexedStrings, SpawnExecutorOptions,
    StdOption
} from './CommonTypes'

export interface SpawnExecutorOptionsBuilder {
    cwd(value: string): SpawnExecutorOptionsBuilder
    env(value: object): SpawnExecutorOptionsBuilder
    stdio(value: StdOption[] | string): SpawnExecutorOptionsBuilder
    uid(value: number): SpawnExecutorOptionsBuilder
    gid(value: number): SpawnExecutorOptionsBuilder
    argv0(value: string): SpawnExecutorOptionsBuilder
    detached(value: boolean): SpawnExecutorOptionsBuilder
    shell(value: boolean | string): SpawnExecutorOptionsBuilder
    windowsHide(value: boolean): SpawnExecutorOptionsBuilder
    build(): SpawnExecutorOptions
}

export interface ForkExecutorOptionsBuilder {
    cwd(value: string): ForkExecutorOptionsBuilder
    env(value: object): ForkExecutorOptionsBuilder
    stdio(value: StdOption[] | string): ForkExecutorOptionsBuilder
    uid(value: number): ForkExecutorOptionsBuilder
    gid(value: number): ForkExecutorOptionsBuilder
    execPath(value: string): ForkExecutorOptionsBuilder
    execArgv(value: string[]): ForkExecutorOptionsBuilder
    silent(value: boolean): ForkExecutorOptionsBuilder
    build(): ForkExecutorOptions
}

export interface SpawnExecutorBuilder {
    filter(predicate: (context: ExecutionContext) => boolean): SpawnExecutorBuilder
    arg(argument: string): SpawnExecutorBuilder
    args(values: string[]): SpawnExecutorBuilder
    options(opts: SpawnExecutorOptions): SpawnExecutorBuilder
    build(): Executor
}

export interface ForkExecutorBuilder {
    filter(predicate: (context: ExecutionContext) => boolean): ForkExecutorBuilder
    arg(argument: string): ForkExecutorBuilder
    args(values: string[]): ForkExecutorBuilder
    options(opts: ForkExecutorOptions): ForkExecutorBuilder
    build(): Executor
}

export interface ExecutorsFactory {
    shell(command: string, extensions?: IndexedStrings): SpawnExecutorBuilder
    binary(command: string, extensions?: IndexedStrings): SpawnExecutorBuilder
    node(modulePath: string): ForkExecutorBuilder
    npm(): SpawnExecutorBuilder
    yarn(): SpawnExecutorBuilder
    mvn(): SpawnExecutorBuilder
    gulp(): ForkExecutorBuilder
    webpack(): ForkExecutorBuilder
}

export interface MonorepoBuild {
    packages(dir: string): MonorepoBuild
    withExecutor(name: string | string[], executor: Executor | Executor[]): MonorepoBuild
    execute(callbacks?: ExecutionCallbacks): void
}

export interface Command {
    run(): void
}

export interface SpawnCommandBuilder {
    args(value: string[]): SpawnCommandBuilder
    callbacks(value: ExecutionCallbacks): SpawnCommandBuilder
    options(value: SpawnExecutorOptions): SpawnCommandBuilder
    build(): Command
}

export interface ForkCommandBuilder {
    args(value: string[]): ForkCommandBuilder
    callbacks(value: ExecutionCallbacks): ForkCommandBuilder
    options(value: SpawnExecutorOptions): ForkCommandBuilder
    build(): Command
}
