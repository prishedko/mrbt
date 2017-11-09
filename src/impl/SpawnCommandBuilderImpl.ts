import {Command, SpawnCommandBuilder, SpawnExecutorBuilder} from '../api/Fluent'
import {ExecutionCallbacks, SpawnExecutorOptions} from '../api/CommonTypes'
import {CommandImpl} from './CommandImpl'

export class SpawnCommandBuilderImpl implements SpawnCommandBuilder {
    private cbs: ExecutionCallbacks

    constructor(private builder: SpawnExecutorBuilder) {}

    args(value: string[]): SpawnCommandBuilder {
        value.forEach(v => this.builder.arg(v))
        return this
    }

    callbacks(value: ExecutionCallbacks): SpawnCommandBuilder {
        this.cbs = value
        return this
    }

    options(value: SpawnExecutorOptions): SpawnCommandBuilder {
        this.builder.options(value)
        return this
    }

    build(): Command {
        return new CommandImpl(this.builder.build(), this.cbs)
    }
}
