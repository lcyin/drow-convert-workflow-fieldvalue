import { ConvertedRecord, ConvertedValue } from './interface/convertedRecord';
import { record, workflow, projectUsers } from './data/data2';
import { getWorkflowFieldValueFormatValueString } from './utils';
import { calculateFormula } from './formula-utils';

function convertRecord(record, workflow, projectUsers): ConvertedRecord {
  const projectUsersMap = getUserMap(projectUsers);
  const statusMap = getStatusMap(workflow.status);
  return {
    referenceId: record.referenceId.toHexString(),
    documentId: record.documentId.toHexString(),
    documentName: workflow.name,
    // todo
    title: 'fdghdgf-hdfgdf',
    // todo
    values: {},
    assigneeIds: record.assigneeIds.map((id) => id.toHexString()),
    // todo
    assigneeNames: record.assigneeIds.map((id) => projectUsersMap[id]['name']),
    statusId: record.statusId.toHexString(),
    // todo
    statusName: statusMap[record.statusId.toHexString()],
    // todo
    dueDate: '2021-10-06T11:35:11.867+08:00',
    dueDateType: record.dueDateType,
    lastModifiedBy: record.lastModifiedBy.toHexString(),
    createdBy: record.createdBy.toHexString(),
    // todo
    lastModifiedName:
      projectUsersMap[record.lastModifiedBy.toHexString()]['name'],
    // todo
    createdName: projectUsersMap[record.createdBy.toHexString()]['name'],
    createDate: record.createDate.toJSON(),
    lastModifyDate: record.lastModifyDate.toJSON(),
  };
}

function getStatusMap(status): { [key: string]: string } {
  const statusMap = {};
  status.forEach((s) => (statusMap[s._id.toHexString()] = s.name));
  return statusMap;
}

function getUserMap(users): {
  [key: string]: {
    name: string;
    title: string;
  };
} {
  const userMap = {};
  users.forEach(
    (user) =>
      (userMap[user._id.toHexString()] = {
        name: user.name,
        title: user.title,
      })
  );
  return userMap;
}

function getHeaderMap(headers) {
  const headerMap = {};
  headers.forEach((h) => {
    headerMap[h._id.toHexString()] = h;
  });
  return headerMap;
}

function getFileConvertedValue(value) {
  let result = {};
  const { fileName, fileType } = value;
  if (fileName && fileType) {
    result = {
      fileName,
      fileType,
    };
  } else {
    result = value;
  }
  return result;
}

function getAutoIdConvertedValue(autoIdvalue) {
  let result = {};
  const { prefix, value } = autoIdvalue;
  result = {
    prefix,
    value: value,
  };
  return result;
}

export function getConvertedValueObject(
  recordvalue,
  recordvalues,
  header,
  parentHeader,
  timezone,
  users,
  tableIndex?
) {
  const fieldValue = getWorkflowFieldValueFormatValueString(
    recordvalue,
    header,
    timezone,
    users
  );
  const result = {
    fieldName: header.fieldName,
    displayValue: fieldValue,
  };
  // Raw Value
  if (header.fieldType === 'AutoId') {
    if (Array.isArray(recordvalue.value)) {
      result[header.fieldType] = recordvalue.value.map((v) =>
        getAutoIdConvertedValue(v)
      );
    } else {
      result[header.fieldType] = getAutoIdConvertedValue(recordvalue.value);
    }
  } else if (header.fieldType === 'Image' || header.fieldType === 'File') {
    if (Array.isArray(recordvalue.value)) {
      result[header.fieldType] = recordvalue.value.map((v) =>
        getFileConvertedValue(v)
      );
    } else {
      result[header.fieldType] = getFileConvertedValue(recordvalue.value);
    }
  } else if (header.fieldType === 'Formula') {
    let formulaResult = null;
    if (!parentHeader) {
      formulaResult = calculateFormula(
        header.config.formula,
        workflow.headers,
        recordvalues,
        undefined
      );
    } else {
      formulaResult = calculateFormula(
        header.config.formula,
        workflow.headers,
        recordvalues,
        tableIndex
      );
    }

    result[header.fieldType] = formulaResult;
  } else {
    result[header.fieldType] = recordvalue.value;
  }
  return result;
}

export function getConvertedTableValues(
  recordvalue,
  recordvalues,
  header,
  timezone,
  users
) {
  const subHeaderMap = getHeaderMap(header.subHeaders);
  const convertedTableValues = recordvalue.value.map((sv, svi) => {
    const convertedSubvalues = {};
    sv.values.forEach((v, vi) => {
      convertedSubvalues[v.fieldId.toHexString()] = getConvertedValueObject(
        v,
        recordvalues,
        subHeaderMap[v.fieldId.toHexString()],
        header,
        timezone,
        users,
        svi
      );
    });
    return convertedSubvalues;
  });
  const result = {
    [header.fieldType]: convertedTableValues,
    fieldName: header.fieldName,
  };
  return result;
}

function convertValue(
  values,
  headers,
  workflow,
  timezone = '+0800',
  users = []
): ConvertedValue {
  const convertedValue = {};
  const headerMap = getHeaderMap(headers);
  values.forEach((value) => {
    const header = headerMap[value.fieldId.toHexString()];
    if (
      header &&
      value &&
      !header.isMulti &&
      header.fieldType !== 'Table' &&
      header.fieldType !== 'Section'
    ) {
      convertedValue[value.fieldId.toHexString()] = getConvertedValueObject(
        value,
        values,
        header,
        undefined,
        timezone,
        projectUsers
      );
    } else {
      if (header.fieldType === 'Table') {
        convertedValue[value.fieldId.toHexString()] = getConvertedTableValues(
          value,
          values,
          header,
          timezone,
          projectUsers
        );
      } else if (header.isMulti) {
        convertedValue[value.fieldId.toHexString()] = getConvertedValueObject(
          value,
          values,
          header,
          undefined,
          timezone,
          projectUsers
        );
      } else {
        convertValue[header.fieldName] = '[Not Found]';
      }
    }
  });
  return convertedValue;
}

const result = convertRecord(record, workflow, projectUsers);
const value = convertValue(
  record.values,
  workflow.headers,
  workflow,
  undefined,
  projectUsers
);
console.log(JSON.stringify(value));
