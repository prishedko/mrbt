import {Command, ForkCommandBuilder, SpawnExecutorBuilder} from '../api/Fluent'
import {ExecutionCallbacks, ForkExecutorOptions} from '../api/CommonTypes'
import {CommandImpl} from './CommandImpl'

export class ForkCommandBuilderImpl implements ForkCommandBuilder {
    private cbs: ExecutionCallbacks

    constructor(private builder: SpawnExecutorBuilder) {}

    args(value: string[]): ForkCommandBuilder {
        value.forEach(v => this.builder.arg(v))
        return this
    }

    callbacks(value: ExecutionCallbacks): ForkCommandBuilder {
        this.cbs = value
        return this
    }

    options(value: ForkExecutorOptions): ForkCommandBuilder {
        this.builder.options(value)
        return this
    }

    build(): Command {
        return new CommandImpl(this.builder.build(), this.cbs)
    }
}
