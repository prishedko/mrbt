import {MonorepoBuildDescription} from './api/Description'
import {readCommandLineArgs} from './impl/CommandLineArgsHelper'

export * from './api/CommonTypes'
export * from './api/Description'
export * from './api/Fluent'

import {
    Command,
    ExecutorsFactory, ForkCommandBuilder, ForkExecutorOptionsBuilder, MonorepoBuild, SpawnCommandBuilder,
    SpawnExecutorOptionsBuilder
} from './api/Fluent'
import {SpawnExecutorOptionsBuilderImpl} from './impl/SpawnExecutorOptionsBuilderImpl'
import {ForkExecutorOptionsBuilderImpl} from './impl/ForkExecutorOptionsBuilderImpl'
import {ExecutionCallbacks, Executor, IndexedStrings} from './api/CommonTypes'
import {MonorepoBuildImpl} from './impl/MonorepoBuildImpl'
import {ExecutorsFactoryImpl} from './impl/ExecutorsFactoryImpl'
import {MonorepoBuildDescriptionRunner} from './impl/MonorepoBuildDescriptionRunner'
import {SpawnCommandBuilderImpl} from './impl/SpawnCommandBuilderImpl'
import {ForkCommandBuilderImpl} from './impl/ForkCommandBuilderImpl'
import {CommandImpl} from './impl/CommandImpl'

export const executors: ExecutorsFactory = new ExecutorsFactoryImpl()

export namespace fluent {
    export namespace options {

        export function spawn(): SpawnExecutorOptionsBuilder {
            return new SpawnExecutorOptionsBuilderImpl()
        }

        export function fork(): ForkExecutorOptionsBuilder {
            return new ForkExecutorOptionsBuilderImpl()
        }
    }

    export function mrbt(defaultExecutor: Executor | Executor[]): MonorepoBuild {
        return new MonorepoBuildImpl(defaultExecutor)
    }
}

export function mrbt(description: MonorepoBuildDescription): void {
    new MonorepoBuildDescriptionRunner(description).run()
}

export namespace command {
    export function command(executor: Executor, callbacks?: ExecutionCallbacks): Command {
        return new CommandImpl(executor, callbacks)
    }

    export function shell(command: string, extensions: IndexedStrings = {}): SpawnCommandBuilder {
        return new SpawnCommandBuilderImpl(executors.shell(command, extensions))
    }

    export function binary(command: string, extensions: IndexedStrings = {}): SpawnCommandBuilder {
        return new SpawnCommandBuilderImpl(executors.binary(command, extensions))
    }

    export function node(modulePath: string): ForkCommandBuilder {
        return new ForkCommandBuilderImpl(executors.node(modulePath))
    }

    export function yarn(args: string[], done: () => void): void {
        new SpawnCommandBuilderImpl(executors.yarn())
            .args(args)
            .callbacks({
                onComplete: done
            })
            .build()
            .run()
    }

    export function npm(args: string[], done: () => void): void {
        new SpawnCommandBuilderImpl(executors.npm())
            .args(args)
            .callbacks({
                onComplete: done
            })
            .build()
            .run()
    }

    export function mvn(args: string[], done: () => void): void {
        new SpawnCommandBuilderImpl(executors.mvn())
            .args(args)
            .callbacks({
                onComplete: done
            })
            .build()
            .run()
    }

    export function gulp(args: string[], done: () => void): void {
        new SpawnCommandBuilderImpl(executors.gulp())
            .args(args)
            .callbacks({
                onComplete: done
            })
            .build()
            .run()
    }

    export function webpack(args: string[], done: () => void): void {
        new SpawnCommandBuilderImpl(executors.webpack())
            .args(args)
            .callbacks({
                onComplete: done
            })
            .build()
            .run()
    }
}

export namespace utils {
    export const args = readCommandLineArgs
}
