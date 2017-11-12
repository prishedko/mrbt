const mrbt = require('mrbt')

// This is an example of using MRBT Fluent API
mrbt.fluent
    .mrbt([
        mrbt.executors.binary('pwd')
            .build(),
        mrbt.executors.binary('echo')
            .arg('I am second default executor')
            .build()
    ])
    .withExecutor(
        // using custom executors for these packages
        ['package-a', 'package-c'],
        [
            mrbt.executors.binary('echo')
                .arg('"Start build of a package"')
                .build(),
            mrbt.executors.binary('pwd')
                .build(),
            mrbt.executors.binary('ls')
                .arg('-l')
                .arg('-a')
                .arg('-P')
                .build(),
            mrbt.executors.binary('echo')
                .arg('"End of the build"')
                .build()
        ]
    )
    // want to filter this package
    .withExecutor(
        'package-d',
        mrbt.executors.binary('unexisting_command')
            .filter(() => false)
            .build()
    )
    // want to use gulp to build this package
    .withExecutor(
        'package-e',
        mrbt.executors.gulp()
            .build())
    // want to use non-default gulp task to build this package
    // also gulpfile.js in that package contains examples of using MRBT utils
    .withExecutor(
        'package-f',
        mrbt.executors.gulp()
            .arg('clean')
            .arg('build')
            .arg('publish')
            .build()
    )
    .execute()
