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