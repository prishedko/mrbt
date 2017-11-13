export function readCommandLineArgs(prefix: string): string[] {
    prefix = prefix + '='
    return process.argv.filter(v => v.indexOf(prefix) === 0).reduce((acc, v) => {
        acc.push(v.replace(prefix, ''))
        return acc
    }, [] as string[])
}

export function readMrbtCommandLineArgs(command: string): string[] {
    const prefix = `mrbt-${command}`
    return readCommandLineArgs(prefix)
}

export function addMrbtCommandLineArgs(command: string, args: string[]): string[] {
    return [...args, ...readMrbtCommandLineArgs(command)]
}
