import * as Stream from 'stream'

/**
 * Type that describes values of <a href="https://nodejs.org/api/child_process.html#child_process_options_stdio"></a>
 */
export type StdOption = undefined | null | string | number | Stream

export type IndexedStrings = {
    [key: string]: string
}

export type ExecutionContext = {
    platform: string
}

export interface CommonExecutorOptions {
    /**
     * Current working directory of the child process.
     */
    readonly cwd?: string
    /**
     * Environment key-value pairs.
     */
    readonly env?: object
    /**
     * Child's stdio configuration (see https://nodejs.org/api/child_process.html#child_process_options_stdio).
     */
    readonly stdio?: StdOption[] | string
    /**
     * Sets the user identity of the process (see setuid(2)).
     */
    readonly uid?: number
    /**
     * Sets the group identity of the process (see setgid(2)).
     */
    readonly gid?: number
}

/**
 * https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 */
export interface SpawnExecutorOptions extends CommonExecutorOptions {
    /**
     * Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
     */
    readonly argv0?: string
    /**
     * Prepare child to run independently of its parent process. Specific behavior depends on the platform, see
     * options.detached).
     */
    readonly detached?: boolean
    /**
     * If true, runs command inside of a shell. Uses '/bin/sh' on UNIX, and process.env.ComSpec on Windows. A different
     * shell can be specified as a string. See Shell Requirements and Default Windows Shell. Default: false (no shell).
     */
    readonly shell?: boolean | string
    /**
     * Hide the subprocess console window that would normally be created on Windows systems
     */
    readonly windowsHide?: boolean
}

export interface ForkExecutorOptions extends CommonExecutorOptions {
    /**
     * Executable used to create the child process.
     */
    readonly execPath?: string
    /**
     * List of string arguments passed to the executable. Default: process.execArgv
     */
    readonly execArgv?: string[]
    /**
     * If true, stdin, stdout, and stderr of the child will be piped to the parent, otherwise they will be inherited
     * from the parent, see the 'pipe' and 'inherit' options for child_process.spawn()'s stdio for more details.
     * Default: false
     */
    readonly silent?: boolean
}

export type ExecutorOptions = SpawnExecutorOptions | ForkExecutorOptions

export type ExecutionCallbacks = {
    onComplete?: () => void
    onError?: (error: Error) => void
}

export interface Executor {
    execute(options: ExecutorOptions, callbacks?: ExecutionCallbacks): void
}

export interface PackageExecutors {
    [packageName: string]: Executor | Executor[]
}
