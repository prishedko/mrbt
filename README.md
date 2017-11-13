# Introduction
This package is a set of tools that simplifies building of JavaScript monorepositories that are orginized by tools like
[Lerna](https://lernajs.io/) and [Yarn Workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).
*mrbt* has two parts:
1. Monorepo build.
2. Utils.

## Monorepo build

JavaScript monorepositories usually contain several JavaScript packages that are placed in *package* folder and that
depends on each other. So when we want to build such monorepo, we need to build every its package in order that takes in
accout dependencies between packages. *Monorepo build* is a set of classes that:
1. Allows to describe how to build every package in monorepo
2. Executs building commands of packages in correct order

Description of build process answers the following questions:
1. Where are packages? By default packages are placed in *packages* folder, but it can be any other.
2. What is default build command(s)? Quite often build procedure are the same for most packages in a monorepo, for
example, it can include one or several commands that are the same for most repos like:
    ```bash
    yarn clean && yarn gulp && npm publish
    ```
    So to avoid repeating the same set of commands for every package, you define default command(s) that will be
    executed for every package without redefined command (see next item).
3. How to redefine the default build command? For some packages build procedure can be different, so we need to specify
that we don't want to use default command to build this particular package(s) and define what command(s) should be used
instead.

*Monorepo build* has two types of API: Fluent API that allows to describe build process by using builders, and
Description API that allows to describe build process by using description JavaScript object. The APIs functionally
identical. You can find more about APIs in [API documentation](https://prishedko.github.io/mrbt/).

## Utils

Utils contains helpers that are not part of *Monorepo build* and that can be used in any node application outside of
*Monorepo build* process.

Please find [API documentation on GitPages](https://prishedko.github.io/mrbt/)

## Passing command line arguments

Usually command line arguments are described for each executor separately. But also you can pass arguments that will be
passed in every executor of given type. For that you just need to add command line argument for build script, and this
argument shoud have the following format:
```bash
mrbt-[executor command]=[argument value]
```
MRBT will remove prefix and pass *argument value* part as argument in every executor with
*command === executor command part*.
For example, you have several executors that run *mvn* command and you want to
pass *-s /path/settings.xml* in every *mvn* command to enforce using custom settings. For that you can write:
```bash
node build.js mrbt-mvn=-s mrbt-mvn=/path/settings.xml
```
and MRBT will pass *-s* and */path/settings.xml* arguments in every executor that runs *mvn* command; it will be done
in addition to arguments that are described in executors configuration.
Also you can inject arguments with some prefix in partical executors. For example, you build package *package-a* by
using *gulp* and you want to provide list of gulp tasks by using command line arguments. To implement that you need
to define you executor in the following way:
```javascript 1.7
{
    package: 'package-a',
    executor: {
        type: 'gulp',
        args: [...mrbt.utils.args('package-a')]
    }
}
```
and then in command line pass all required tasks like this:
```bash
node build.js package-a=clean package-a=build package-a=deploy
```
