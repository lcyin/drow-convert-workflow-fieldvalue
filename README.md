# Workflow Record Convertor

Convert Workflow Record to Elasticsearch object.
[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/node-hcyaiq)

# Workflow Record Type

## Single Values

- 'String'
- 'LongText'
- 'AutoId'
- 'Set'
- 'Number'
- 'Boolean'
- 'DateTime'
- 'Url'
- 'FilePath'
- 'User'
- 'Formula'
- 'Model'

## Multiple Values

- 'String'
- 'LongText'
- 'AutoId'
- 'Set'
- 'Number'
- 'DateTime'
- 'File'
- 'Image'
- 'Url'
- 'FilePath'
- 'User'

## Table Subvalues

- 'String'
- 'LongText'
- 'Set'
- 'Number'
- 'Boolean'
- 'DateTime'
- 'File'
- 'Image'
- 'Url'
- 'FilePath'
- 'User'
- 'Formula'

## Running Tests

To run tests, run the following command

```bash
  yarn test test/convert.spec.ts
```

## Usage/Examples

- Sample workflow in [here](https://drow.cloud/workflow/kevin-lais-project/convert-fieldvalue/test-convert-fieldvalue/61e7dfeaa6d0ad43400a1f84)
- Sample record in [here](http://drow.cloud/workflow/kevin-lais-project/convert-fieldvalue/test-convert-fieldvalue/61e7dfeaa6d0ad43400a1f84/record/61e7e02ca6d0ad43400a202d)
- Sample project users are mock data.

```javascript

import { record, workflow, projectUsers } from './data/data2';

const result = convertRecord(record, workflow, projectUsers);

console.log(JSON.stringify(result));


```

## Authors

- [@lcyin](https://www.github.com/lcyin)
