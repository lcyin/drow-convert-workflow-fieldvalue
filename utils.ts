import { ObjectId } from 'bson';
import balanced = require('balanced-match');
import * as moment from 'moment';

export const getDocumentCommonFormatValueString = (value) => {
  const toString = (v) => (v ? v.toString() : '');

  return Array.isArray(value.value)
    ? value.value.map((v) => toString(v))
    : toString(value.value);
};

export const getDocumentBooleanFormatValueString = (value) => {
  const boolValueToStr = (boolValue: boolean) => (boolValue ? 'true' : 'false');

  return Array.isArray(value.value)
    ? value.value.map((v) => boolValueToStr(v))
    : boolValueToStr(value.value);
};

export const getDocumentDateTimeFormatValueString = (
  value,
  header,
  timezone: string = '+0800'
) => {
  checkHeaderIdMatch(value.fieldId, header._id);

  const dateTimeValueToStr = (dateValue: Date, dateType, offset?: number) =>
    dateValue
      ? (dateType === 'dateTimeLocal'
          ? moment(new Date(dateValue)).add(-offset, 'minutes')
          : moment(new Date(dateValue))
        )
          .utc()
          .format(getMomentDateTimeFormat(dateType))
      : '';

  return header.isMulti
    ? (value.value as Date[]).map((v) =>
        dateTimeValueToStr(
          v,
          header.config.dateType,
          timezoneStringToOffset(timezone)
        )
      )
    : dateTimeValueToStr(
        value.value as Date,
        header.config.dateType,
        timezoneStringToOffset(timezone)
      );
};

export const checkHeaderIdMatch = (
  valueFieldId: ObjectId,
  headerId: ObjectId
) => {
  if (valueFieldId.toHexString() !== headerId.toHexString()) {
    throw new Error('Document value convert error: Header Id not match');
  }
};

export function timezoneStringToOffset(timezone: string) {
  return (
    (timezone.slice(0, 1) === '-' ? 1 : -1) *
    (parseInt(timezone.slice(1, 3), 10) * 60 +
      parseInt(timezone.slice(3, 5), 10))
  );
}

export function getMomentDateTimeFormat(dateType): string {
  switch (dateType) {
    case 'dateTimeUtc':
    case 'dateTimeLocal':
      return 'YYYY-MM-DD HH:mm';
    case 'dateOnly':
      return 'YYYY-MM-DD';
    case 'timeOnly':
      return 'HH:mm';
    default:
      return null;
  }
}

export const getDocumentSetFormatValueString = (value, header) => {
  checkHeaderIdMatch(value.fieldId, header._id);

  const setValueToStr = (setValue: string, options) => {
    if (setValue) {
      const option = options.find((o) => o._id.toHexString() === setValue);
      return option ? option.value : setValue;
    } else {
      return '';
    }
  };

  return header.isMulti
    ? (value.value as string[]).map((v) =>
        setValueToStr(v, header.config.options)
      )
    : setValueToStr(value.value as string, header.config.options);
};

export const getWorkflowFileFormatValueString = (value) =>
  getDocumentFileFormatValueString(value);

export const getDocumentFileFormatValueString = (value) => {
  const fileToStr = (f) => (f ? `${f.fileName}.${f.fileType}` : '');

  return Array.isArray(value.value)
    ? value.value.map((v) => fileToStr(v))
    : fileToStr(value.value);
};

export const getWorkflowAutoIdFormatValueString = (value, header) =>
  getDocumentAutoIdFormatValueString(value, header);

export const getDocumentAutoIdFormatValueString = (value, header) => {
  checkHeaderIdMatch(value.fieldId, header._id);

  const autoIdToStr = (autoIdValue, autoIdPrefixes) => {
    if (autoIdValue && autoIdValue.value) {
      const autoIdPrefix = autoIdPrefixes.find(
        (p) => p.prefix === autoIdValue.prefix
      );

      return autoIdPrefix
        ? autoIdFormatValueString(
            autoIdPrefix.prefix,
            autoIdValue.value,
            autoIdPrefix.digit
          )
        : autoIdFormatValueString(autoIdValue.prefix, autoIdValue.value);
    } else {
      return '';
    }
  };

  return header.isMulti
    ? value.value.map((v) => autoIdToStr(v, header.config.autoIdPrefixes))
    : autoIdToStr(value.value, header.config.autoIdPrefixes);
};

export function autoIdFormatValueString(
  prefix: string,
  value: number,
  digit?: number
) {
  if (!!digit) {
    return `${prefix}${value.toString().padStart(digit, '0')}`;
  } else {
    return `${prefix}${value.toString()}`;
  }
}

export const getWorkflowUserFormatValueString = (
  value,
  header,
  timezone = '+0800',
  users = []
): string | string[] =>
  getDocumentUserFormatValueString(value, header, timezone, users);

export const getDocumentUserFormatValueString = (
  value,
  header,
  timezone = '+0800',
  users = []
): string | string[] => {
  checkHeaderIdMatch(value.fieldId, header._id);

  const userValueToString = (userValue: string) => {
    if (userValue) {
      const user = users?.find((u) => u?._id?.toHexString() === userValue);
      return user ? user.name : userValue;
    }
    return '';
  };
  return header.isMulti
    ? (value.value as string[]).map((v) => userValueToString(v))
    : userValueToString(value.value as string);
};

export const WorkflowFieldValueSingleDataGetFormatValueStrFnComplex = {
  String: getDocumentCommonFormatValueString,
  LongText: getDocumentCommonFormatValueString,
  Number: getDocumentCommonFormatValueString,
  DateTime: getDocumentDateTimeFormatValueString,
  Formula: getDocumentCommonFormatValueString,
  Boolean: getDocumentBooleanFormatValueString,
  Set: getDocumentSetFormatValueString,
  Url: getDocumentCommonFormatValueString,
  Image: getWorkflowFileFormatValueString,
  File: getWorkflowFileFormatValueString,
  FilePath: getDocumentCommonFormatValueString,
  Model: getDocumentCommonFormatValueString,
  AutoId: getWorkflowAutoIdFormatValueString,
  User: getWorkflowUserFormatValueString,
};

export const WorkflowFieldValueMultipleDataGetFormatValueStrFnComplex = {
  'Multi-String': getDocumentCommonFormatValueString,
  'Multi-LongText': getDocumentCommonFormatValueString,
  'Multi-Number': getDocumentCommonFormatValueString,
  'Multi-DateTime': getDocumentDateTimeFormatValueString,
  'Multi-Formula': getDocumentCommonFormatValueString,
  'Multi-Boolean': getDocumentBooleanFormatValueString,
  'Multi-Set': getDocumentSetFormatValueString,
  'Multi-Url': getDocumentCommonFormatValueString,
  'Multi-Image': getWorkflowFileFormatValueString,
  'Multi-File': getWorkflowFileFormatValueString,
  'Multi-FilePath': getDocumentCommonFormatValueString,
  'Multi-Model': getDocumentCommonFormatValueString,
  'Multi-AutoId': getWorkflowAutoIdFormatValueString,
  'Multi-User': getWorkflowUserFormatValueString,
};

export const getWorkflowFieldValueFormatValueString = (
  value,
  header,
  timezone?: string,
  users = []
) => {
  return WorkflowFieldValueSingleDataGetFormatValueStrFnComplex[value.__t]
    ? WorkflowFieldValueSingleDataGetFormatValueStrFnComplex[value.__t](
        value,
        header,
        timezone,
        users
      )
    : WorkflowFieldValueMultipleDataGetFormatValueStrFnComplex[value.__t](
        value,
        header,
        timezone,
        users
      );
};

export function getHeaderByFieldId(workflow, fieldId, subfieldId?: string) {
  const workflowFieldHeader = workflow.headers.find(
    (wh) => wh._id.toString() === fieldId
  );
  let workflowSubFieldHeader;
  if (subfieldId) {
    workflowSubFieldHeader = workflowFieldHeader.subHeaders.find(
      (swf) => swf._id.toHexString() === subfieldId
    );
  }
  return workflowSubFieldHeader ? workflowSubFieldHeader : workflowFieldHeader;
}

export function getHeaderById(fieldId, headers = []) {
  if (!headers || headers.length <= 0) {
    return null;
  }
  if (!fieldId) {
    return null;
  }
  const header = headers.find((h) => {
    if (h.fieldType === 'Table') {
      const sHeader = h.subHeaders?.find(
        (sh) => sh._id?.toString() === fieldId.toString()
      );
      if (sHeader) {
        return sHeader;
      }
    }
    return h._id?.toString() === fieldId.toString();
  });
  const subHeader = header?.subHeaders?.find(
    (sh) => sh._id?.toString() === fieldId.toString()
  );
  return subHeader ? subHeader : header;
}

export function dateTimeValueToStr(value, dateType): string {
  return value
    ? moment(new Date(value)).format(getMomentDateTimeFormat(dateType))
    : '';
}

export function checkProjectRoleCondition(condition, userProjectRoleId) {
  if (!condition) {
    return false;
  }
  return condition.projectRoleId.toString() === userProjectRoleId?.toString();
}

export function apiDateToMomentDate(date, dateType) {
  let momentDate;

  if (
    dateType === 'dateTimeUtc' ||
    dateType === 'dateOnly' ||
    dateType === 'timeOnly'
  ) {
    // if no timeOnly value, init it
    if (!date && dateType === 'timeOnly') {
      momentDate = moment('1970-01-01 00:00'); // no need to subsctract
    } else {
      const utcOffset = moment().utcOffset();
      momentDate = moment(date).subtract(utcOffset, 'minutes');
    }
  } else {
    momentDate = moment(date);
  }

  return momentDate;
}

export const recordTitleFormatStringParam = {
  maxlength: 20,
  leftBracket: '{{',
  rightBracket: '}}',
};

export function convertRecordTitle(
  workflowRecord,
  workflow,
  timezone = '+0800',
  users
) {
  function replaceKeysWithBracketOnString(
    str: string,
    keyValuePairsObject: { [key: string]: string },
    leftBracket: string,
    rightBracket: string
  ): string {
    const balancedResult = balanced(leftBracket, rightBracket, str);
    if (balancedResult) {
      const body =
        typeof keyValuePairsObject[balancedResult.body] === 'string'
          ? keyValuePairsObject[balancedResult.body]
          : `${leftBracket}${balancedResult.body}${rightBracket}`;

      return `${balancedResult.pre}${body}${replaceKeysWithBracketOnString(
        balancedResult.post,
        keyValuePairsObject,
        leftBracket,
        rightBracket
      )}`;
    } else {
      return str;
    }
  }

  function genReplaceKeysOnFormatStringFunction(
    leftBracket: string = '{{',
    rightBracket: string = '}}'
  ) {
    return (
      formatString: string,
      keyValuePairsObject: { [key: string]: string }
    ) =>
      replaceKeysWithBracketOnString(
        formatString,
        keyValuePairsObject,
        leftBracket,
        rightBracket
      );
  }

  const getWorkflowRecordTitleByReplaceKeys = (
    recordTitleFormatString: string,
    keyValuePairsObject: { [key: string]: string }
  ) =>
    genReplaceKeysOnFormatStringFunction(
      recordTitleFormatStringParam.leftBracket,
      recordTitleFormatStringParam.rightBracket
    )(recordTitleFormatString, keyValuePairsObject);

  function getKeysInBracketsFromString(
    str: string,
    leftBracket: string,
    rightBracket: string
  ) {
    const result: string[] = [];

    const balancedResult = balanced(leftBracket, rightBracket, str);
    if (balancedResult) {
      result.push(balancedResult.body);

      getKeysInBracketsFromString(
        balancedResult.post,
        leftBracket,
        rightBracket
      ).forEach((s) => {
        if (s !== result[0]) result.push(s);
      });

      return result;
    } else {
      return result;
    }
  }
  function genGetKeysFromFormatStringFunction(
    leftBracket: string = '{{',
    rightBracket: string = '}}'
  ) {
    return (formatString: string) =>
      getKeysInBracketsFromString(formatString, leftBracket, rightBracket);
  }

  const getKeysFromWorkflowRecordTitleFormatString = (
    recordTitleFormatString: string
  ) =>
    genGetKeysFromFormatStringFunction(
      recordTitleFormatStringParam.leftBracket,
      recordTitleFormatStringParam.rightBracket
    )(recordTitleFormatString);

  const recordTitleKeys = getKeysFromWorkflowRecordTitleFormatString(
    workflow.recordTitleFormatString
  );
  const keyValuePairsObject: { [key: string]: string } = {};
  for (const recordTitleKey of recordTitleKeys) {
    const targetValue = workflowRecord.values.find(
      (v) => v.fieldId.toHexString() === recordTitleKey
    );
    const targetHeader = workflow.headers.find(
      (h) => h._id.toHexString() === recordTitleKey
    );

    // if can find the value, header and it is not multi and table
    if (
      targetValue &&
      targetHeader &&
      !targetHeader.isMulti &&
      targetHeader.fieldType !== 'Table'
    ) {
      keyValuePairsObject[recordTitleKey] =
        getWorkflowFieldValueFormatValueString(
          targetValue,
          targetHeader,
          timezone,
          users
        ) as string;
    } else {
      keyValuePairsObject[recordTitleKey] = '';
    }
  }

  const recordTitle = getWorkflowRecordTitleByReplaceKeys(
    workflow.recordTitleFormatString,
    keyValuePairsObject
  );
  return recordTitle;
}
