### Example of MRBT using

This example is a monorepository that is managed by Yarn Workspace. There are two identical MRBT configurations
that build this monorepository:
1. *./scripts/description.js* uses MRBT Description API
2. *./scripts/fluent.js* uses MRBT Fluent API
To run the configuration execute the following commands:
```bash
yarn
yarn description
yarn fluent
```