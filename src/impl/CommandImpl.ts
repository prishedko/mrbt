import {ExecutionCallbacks, Executor} from '../api/CommonTypes'
import * as path from 'path'
import {Command} from '../api/Fluent'

export class CommandImpl implements Command {
    constructor(private executor: Executor, private callbacks?: ExecutionCallbacks) {}

    run(): void {
        this.executor.execute(
            {
                cwd: path.resolve('.')
            },
            this.callbacks
        )
    }
}
