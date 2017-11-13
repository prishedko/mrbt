const mrbt = require('mrbt')

// This is an example of using MRBT Description API
mrbt.mrbt({
    defaultExecutor: [
        {
            type: 'binary',
            command: 'pwd'
        },
        {
            type: 'binary',
            command: 'echo',
            args: ['I am second default executor']
        }
    ],
    packageExecutors: [
        {
            // using custom executors for these packages
            package: ['package-a', 'package-c'],
            executor: [
                {
                    type: 'binary',
                    command: 'echo',
                    args: ['"Start build of a package"']
                },
                {
                    type: 'binary',
                    command: 'pwd'
                },
                {
                    type: 'binary',
                    command: 'ls',
                    args: ['-l', '-a', '-P']
                },
                {
                    type: 'binary',
                    command: 'echo',
                    args: ['"End of the build"']
                }
            ]
        },
        {
            // want to filter this package
            package: 'package-d',
            executor: {
                type: 'binary',
                command: 'unexisting_command',
                filter: () => false
            }
        },
        {
            // want to use gulp to build this package
            package: 'package-e',
            executor: {
                type: 'gulp'
            }
        },
        {
            // want to use non-default gulp task to build this package
            // also gulpfile.js in that package contains examples of using MRBT utils
            // and here we read arguments from command line
            package: 'package-f',
            executor: {
                type: 'gulp',
                args: ['clean', 'build', ...mrbt.utils.args('package-f-gulp')]
            }
        }
    ]
})
