import {ExecutorDescriptor, ExecutorType, MonorepoBuildDescription} from '../api/Description'
import {MonorepoBuildImpl} from './MonorepoBuildImpl'
import {Executor} from '../api/CommonTypes'
import {assert, isInexact, log} from './Utils'
import {ExecutorsFactoryImpl} from './ExecutorsFactoryImpl'
import {ForkExecutorBuilder, SpawnExecutorBuilder} from '../api/Fluent'
import chalk from 'chalk'

export class MonorepoBuildDescriptionRunner {
    constructor(private description: MonorepoBuildDescription) {
        assert(() => !isInexact(description), 'Build description cannot be null or undefined')
    }

    buildSpawn(descriptor: ExecutorDescriptor, builder: SpawnExecutorBuilder): Executor {
        if (descriptor.filter) {
            builder.filter(descriptor.filter)
        }
        if (descriptor.args) {
            descriptor.args.forEach(v => builder.arg(v))
        }
        if (descriptor.options) {
            builder.options(descriptor.options)
        }
        return builder.build()
    }

    buildFork(descriptor: ExecutorDescriptor, builder: ForkExecutorBuilder): Executor {
        if (descriptor.filter) {
            builder.filter(descriptor.filter)
        }
        if (descriptor.args) {
            descriptor.args.forEach(v => builder.arg(v))
        }
        if (descriptor.options) {
            builder.options(descriptor.options)
        }
        return builder.build()
    }

    buildExecutor(descriptor: ExecutorDescriptor): Executor {
        assert(() => !isInexact(descriptor.type), 'Type of an executor should be defined')
        const factory = new ExecutorsFactoryImpl()
        switch (descriptor.type) {
            case ExecutorType.shell:
                return this.buildSpawn(descriptor, factory.shell(descriptor.command!, descriptor.extensions))
            case ExecutorType.binary:
                return this.buildSpawn(descriptor, factory.binary(descriptor.command!, descriptor.extensions))
            case ExecutorType.node:
                return this.buildFork(descriptor, factory.node(descriptor.modulePath!))
            case ExecutorType.npm:
                return this.buildSpawn(descriptor, factory.npm())
            case ExecutorType.yarn:
                return this.buildSpawn(descriptor, factory.yarn())
            case ExecutorType.mvn:
                return this.buildSpawn(descriptor, factory.mvn())
            case ExecutorType.gulp:
                return this.buildFork(descriptor, factory.gulp())
            case ExecutorType.webpack:
                return this.buildFork(descriptor, factory.webpack())
            default:
                log.error(`Unknown executor type: ${chalk.bold(descriptor.type)}`)
                throw new Error(`Unknown executor type: ${descriptor.type}`)

        }
    }

    buildExecutors(executor: ExecutorDescriptor | ExecutorDescriptor[]): Executor | Executor[] {
        assert(() => !isInexact(executor), 'Executor cannot be null or undefined')
        if (Array.isArray(executor)) {
            return executor.map(v => this.buildExecutor(v))
        } else {
            return this.buildExecutor(executor)
        }
    }

    run(): void {
        const build = new MonorepoBuildImpl(this.buildExecutors(this.description.defaultExecutor))
        if (this.description.packagesDir) {
            build.packages(this.description.packagesDir)
        }
        if (this.description.packageExecutors) {
            this.description.packageExecutors.forEach(v => {
                build.withExecutor(v.package, this.buildExecutors(v.executor))
            })
        }
        build.execute(this.description.callbacks)
    }
}
