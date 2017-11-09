import {SpawnExecutorBuilderImpl} from './SpawnExecutorBuilderImpl'
import {isInexact, assert, isWin} from './Utils'
import {ForkExecutorBuilderImpl} from './ForkExecutorBuilderImpl'
import * as fs from 'fs'
import {IndexedStrings} from '../api/CommonTypes'
import {ExecutorsFactory, ForkExecutorBuilder, SpawnExecutorBuilder} from '../api/Fluent'

export class ExecutorsFactoryImpl implements ExecutorsFactory {

    shell(command: string, extensions: IndexedStrings = {}): SpawnExecutorBuilder {
        assert(() => !isInexact(command), 'Command cannot not be null or undefined')
        assert(() => typeof command === 'string', 'Command should be a string')
        return new SpawnExecutorBuilderImpl(command, extensions).options({
            stdio: 'inherit',
            env: process.env,
            shell: isWin()
        })
    }

    binary(command: string, extensions: IndexedStrings = {}): SpawnExecutorBuilder {
        assert(() => !isInexact(command), 'Command cannot not be null or undefined')
        assert(() => typeof command === 'string', 'Command should be a string')
        return new SpawnExecutorBuilderImpl(command, extensions).options({
            stdio: 'inherit',
            env: process.env
        })
    }

    node(modulePath: string): ForkExecutorBuilder {
        assert(() => !isInexact(modulePath), 'Module path cannot not be null or undefined')
        assert(() => typeof modulePath === 'string', 'Module path should be a string')
        assert(() => fs.existsSync(modulePath), `File ${modulePath} should exist`)
        assert(() => fs.lstatSync(modulePath).isFile(), `${modulePath} is not a file`)
        return new ForkExecutorBuilderImpl(modulePath)
    }

    npm(): SpawnExecutorBuilder {
        return this.shell('npm', { 'win32': 'cmd' })
    }

    yarn(): SpawnExecutorBuilder {
        return this.shell('yarn', { 'win32': 'cmd' })
    }

    mvn(): SpawnExecutorBuilder {
        return this.shell('mvn', { 'win32': 'cmd' })
    }

    gulp(): ForkExecutorBuilder {
        return this.node(require.resolve('gulp/bin/gulp.js'))
    }

    webpack(): ForkExecutorBuilder {
        return this.node(require.resolve('webpack/bin/webpack.js'))
    }
}
