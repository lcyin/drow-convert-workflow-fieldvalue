import { ObjectId } from 'bson';
import { format } from 'date-fns';
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

export const getWorkflowFieldValueTableData = (
  targetValue,
  subHeaders,
  workflow,
  record,
  timezone = '+0800',
  users = [],
  fieldId: string
) => {
  return targetValue.value.map((targetSubRecord, sri) => {
    return targetSubRecord.values.reduce((subValuesObject, targetSubValue) => {
      const targetSubHeader = subHeaders.find(
        (sh) => sh._id.toString() === targetSubValue.fieldId.toHexString()
      );
      if (targetSubHeader.fieldType === 'Formula') {
        let formulaValue;
        const formulaResult = getConditionFormulaRsult(
          workflow,
          record,
          '',
          fieldId,
          targetSubHeader._id.toHexString(),
          sri
        );
        if (formulaResult instanceof Date) {
          formulaValue = format(formulaResult, 'yyyy-MM-dd');
        } else if (typeof formulaResult === 'number') {
          formulaValue = formulaResult.toString();
        } else {
          formulaValue = formulaResult;
        }
        subValuesObject[targetSubHeader.fieldName] = formulaValue;
      } else {
        subValuesObject[targetSubHeader.fieldName] =
          getWorkflowFieldValueFormatValueString(
            targetSubValue,
            targetSubHeader as any,
            timezone,
            users
          ) as string;
      }
      return subValuesObject;
    }, {});
  });
};

export function getConditionFormulaRsult(
  workflow,
  record,
  userProjectRoleId,
  fieldId,
  subFieldId?,
  subIndex?
) {
  let value = null;
  const resultFunc = (formulaGroup) => {
    return getFormulaResult(
      formulaGroup,
      record.values,
      workflow.headers,
      userProjectRoleId,
      subIndex
    );
  };
  const referenceHeader = getHeaderByFieldId(workflow, fieldId, subFieldId);
  const formula = referenceHeader.config?.formula;
  const matchConditionFormulaGroups = formula.filter((formulaGroup) =>
    checkConditionState(
      formulaGroup?.condition,
      workflow.headers,
      record.values,
      userProjectRoleId
    )
  );
  const elseConditionFormulaGroup = formula.find(
    (formulaGroup) => formulaGroup?.condition?.elseTo
  );
  if (
    Array.isArray(matchConditionFormulaGroups) &&
    matchConditionFormulaGroups.length > 0
  ) {
    // for multi conditions return true, only get the first match result
    const matchConditionFormulaGroup = matchConditionFormulaGroups[0];
    value = resultFunc(matchConditionFormulaGroup);
  } else if (!!elseConditionFormulaGroup) {
    // if else case matched
    value = resultFunc(elseConditionFormulaGroup);
  }
  return value;
}

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

export function checkConditionState(
  condition,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?
) {
  if (!condition) {
    return true;
  }
  if (condition.elseTo) {
    return false;
  }
  const conditionResult = [];
  const conditions = condition.conditions ? condition.conditions : [];
  conditions.forEach((or) => {
    const orResult = [];
    or.forEach((and) => {
      orResult.push(
        checkAndConditionState(
          and,
          headers,
          values,
          userProjectRoleId,
          subIndex
        )
      );
    });
    conditionResult.push(orResult);
  });
  return (
    conditionResult.filter((or) => {
      return or.filter((and) => !and).length <= 0;
    }).length > 0
  );
}

export function checkAndConditionState(
  andCondition,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?
) {
  if (!andCondition) {
    return false;
  }
  if (andCondition.referenceType === 'field-value') {
    return checkFieldValueCondition(
      andCondition.reference,
      headers,
      values,
      userProjectRoleId,
      subIndex
    );
  } else if (andCondition.referenceType === 'project-role') {
    return checkProjectRoleCondition(andCondition.reference, userProjectRoleId);
  } else if (andCondition.referenceType === 'field-empty') {
    return checkFieldEmptyCondition(
      andCondition.reference,
      headers,
      values,
      userProjectRoleId,
      subIndex
    );
  }
  return false;
}

export function checkFieldValueCondition(
  condition,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?
) {
  if (!condition) {
    return false;
  }
  const refField = getHeaderById(condition.fieldId, headers);
  const refValue = getValueByFieldId(
    condition.fieldId,
    headers,
    values,
    userProjectRoleId,
    subIndex
  )?.value;
  const operator = condition.operator;
  const value = condition.value;
  if (refField?.fieldType === 'Number') {
    return checkConditionNumber(refValue, operator, value);
  } else if (refField?.fieldType === 'DateTime') {
    return checkConditionDateTime(
      refValue,
      operator,
      value,
      refField?.config?.dateType
    );
  } else if (refField?.fieldType === 'Set') {
    return checkConditionSet(
      refValue,
      operator,
      value,
      refField?.config?.options,
      refField?.config?.allowOther
    );
  } else if (refField?.fieldType === 'Boolean') {
    return checkConditionBoolean(refValue, operator, value);
  } else if (refField?.fieldType === 'Formula') {
    return checkConditionFormula(
      refField?.config?.formula,
      operator,
      value,
      headers,
      values,
      userProjectRoleId,
      subIndex
    );
  } else if (refField?.fieldType === 'AutoId') {
    return checkConditionAutoId(refValue, operator, value);
  } else {
    return checkConditionOther(refValue, operator, value);
  }
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

export function getValueByFieldId(
  fieldId,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?: number
) {
  if (!values || values.length <= 0) {
    return null;
  }
  if (!fieldId) {
    return null;
  }
  let result = null;
  values.forEach((value) => {
    // only when result is null/undefined, required to find the target field value
    if (!result) {
      const header = getHeaderById(value.fieldId, headers);
      if (header?.fieldType === 'Table') {
        result = value.value[subIndex]?.values?.find(
          (subValue) => subValue.fieldId?.toString() === fieldId?.toString()
        );
      } else if (value.fieldId?.toString() === fieldId?.toString()) {
        if (header?.fieldType === 'Formula') {
          const formulaResult = calculateFormulaWithCondition(
            header.config.formula,
            headers,
            values,
            subIndex,
            userProjectRoleId
          );
          value.value = formulaResult ? formulaResult : 0;
          result = value;
        } else {
          result = value;
        }
      }
    }
  });
  return result;
}

export function calculateFormulaWithCondition(
  formula,
  headers,
  values,
  tableIndex?,
  userProjectRoleId?
) {
  let calResult: string = '';
  let calculatedValue: string;
  let displayUnitAndDateType;

  const resultFunc = (formulaGroup) => {
    const formulaFields = getRelatedFieldsFromFormulaGroup(
      formulaGroup,
      headers
    );
    displayUnitAndDateType = checkDisplayUnitAndDateType(
      formulaGroup,
      formulaFields,
      headers
    );
    const result = getFormulaResult(
      formulaGroup,
      values,
      headers,
      userProjectRoleId,
      tableIndex
    );
    if (result !== null && result !== undefined) {
      calResult = result?.toString();
    }
  };

  const matchConditionFormulaGroups = formula.filter((formulaGroup) =>
    checkConditionState(
      formulaGroup?.condition,
      headers,
      values,
      userProjectRoleId,
      tableIndex
    )
  );
  const elseConditionFormulaGroup = formula.find(
    (formulaGroup) => formulaGroup?.condition?.elseTo
  );
  if (
    Array.isArray(matchConditionFormulaGroups) &&
    matchConditionFormulaGroups.length > 0
  ) {
    // for multi conditions return true, only get the first match result
    const matchConditionFormulaGroup = matchConditionFormulaGroups[0];
    resultFunc(matchConditionFormulaGroup);
  } else if (!!elseConditionFormulaGroup) {
    // if else case matched
    resultFunc(elseConditionFormulaGroup);
  }
  if (
    !displayUnitAndDateType?.displayUnit &&
    displayUnitAndDateType?.calculationDateType
  ) {
    let d = moment(calResult);
    if (
      displayUnitAndDateType.calculationDateType === 'dateTimeUtc' ||
      displayUnitAndDateType.calculationDateType === 'timeOnly' ||
      displayUnitAndDateType.calculationDateType === 'dateOnly'
    ) {
      d = d.subtract(d.utcOffset(), 'minutes');
    }
    const result = d
      ? dateTimeValueToStr(
          d.format(),
          displayUnitAndDateType.calculationDateType
        )
      : '';
    calculatedValue = result !== 'Invalid date' ? result : '';
  } else {
    calculatedValue = calResult ? calResult.toString() : '';
  }
  return calculatedValue;
}

export function dateTimeValueToStr(value, dateType): string {
  return value
    ? moment(new Date(value)).format(getMomentDateTimeFormat(dateType))
    : '';
}

function getRelatedFieldsFromFormulaGroup(formulaGroup, headers = []) {
  const items = formulaGroup.items;
  if (!items) {
    return [];
  }
  if (Array.isArray(items)) {
    const factorA = items[0];
    const factorB = items[2];
    const relatedFields = [];
    if (factorA && factorA.fieldId !== null && factorA.fieldId !== 'Constant') {
      const factorAHeader = getHeaderById(factorA.fieldId, headers);
      if (factorAHeader?.fieldType === 'Formula') {
        const factorAFormulaGroup = factorAHeader?.config?.formula;
        const factorARelatedFieldIds = getRelatedFieldsFromFormulaGroup(
          factorAFormulaGroup as any,
          headers
        );
        relatedFields.concat(factorARelatedFieldIds);
      } else {
        relatedFields.push(factorA.fieldId);
      }
    }
    if (
      factorB &&
      factorB.fieldId !== null &&
      (factorB as any).fieldId !== 'Constant'
    ) {
      const factorBHeader = getHeaderById(factorB.fieldId);
      if (factorBHeader?.fieldType === 'Formula') {
        const factorBFormulaGroup = factorBHeader?.config?.formula as any;
        const factorBRelatedFieldIds = getRelatedFieldsFromFormulaGroup(
          factorBFormulaGroup,
          headers
        );
        relatedFields.concat(factorBRelatedFieldIds);
      } else {
        relatedFields.push((factorB as any).fieldId);
      }
    }

    return relatedFields;
  } else {
    return getRelatedFieldsFromFormulaGroup(items, headers);
  }
}

function checkDisplayUnitAndDateType(formulaGroup, fieldIds = [], headers) {
  if (!formulaGroup) {
    return;
  }
  let displayUnit;
  let calculationDateType;
  const operator =
    Array.isArray(formulaGroup.items) && formulaGroup.items?.length > 0
      ? formulaGroup.items[1]
      : null;
  // sum, count, average => no need to check date time type
  if (operator === 'sum' || operator === 'count' || operator === 'average') {
    return {
      displayUnit: null,
      calculationDateType: null,
    };
  }

  if (!fieldIds) {
    return;
  }
  let counter = 0;
  fieldIds.forEach((fieldId) => {
    const header = getHeaderById(fieldId, headers);
    if (header?.fieldType === 'DateTime') {
      calculationDateType = header?.config?.dateType;
      counter++;
    }
  });
  if (counter > 1) {
    // Date Time - Date Time
    displayUnit = 'CMN_DAY';
  } else {
    displayUnit = null;
  }
  return { displayUnit, calculationDateType };
}

export function getFormulaResult(
  formulaGroup,
  values = [],
  headers = [],
  userProjectRoleId,
  subIndex?
) {
  const items = formulaGroup?.items;
  if (!items) {
    return null;
  }
  if (Array.isArray(items)) {
    const factorA = items[0];
    const operator = items[1];
    const factorB = items[2];
    // check factor reference field id
    if (factorA && !factorA.fieldId) {
      const aHeader = getHeaderByName(factorA?.fieldName, headers);
      factorA.fieldId = aHeader?._id;
    }
    if (factorB && !factorB.fieldId) {
      if (factorB?.fieldType === 'Constant') {
        factorB.fieldId = 'Constant';
      } else {
        const bHeader = getHeaderByName(factorB?.fieldName, headers);
        factorB.fieldId = bHeader?._id;
      }
    }
    if (operator === 'sum') {
      const factors = getFormulaFieldValueArray(
        factorA?.fieldId,
        values,
        headers,
        userProjectRoleId
      );
      return calculationSum(factors);
    } else if (operator === 'average') {
      const factors = getFormulaFieldValueArray(
        factorA?.fieldId,
        values,
        headers,
        userProjectRoleId
      );
      return calculationAverage(factors);
    } else if (operator === 'count') {
      const factors = getFormulaFieldValueArray(
        factorA?.fieldId,
        values,
        headers,
        userProjectRoleId
      );
      return calculationCount(factors);
    } else if (
      operator === 'plus' ||
      operator === 'minus' ||
      operator === 'multiply' ||
      operator === 'divide'
    ) {
      const factA = getFormulaFieldValue(
        factorA?.fieldId,
        values,
        headers,
        userProjectRoleId,
        subIndex
      );
      let factAType = getHeaderById(factorA?.fieldId, headers)?.fieldType;
      if (factAType === 'Formula') {
        factAType = typeof factA === 'number' ? 'Number' : 'DateTime';
      }
      const factB =
        factorB?.fieldId?.toString() === 'Constant' ||
        factorB?.fieldType === 'Constant'
          ? factorB?.constant
          : getFormulaFieldValue(
              factorB?.fieldId,
              values,
              headers,
              userProjectRoleId,
              subIndex
            );
      const factBType =
        factorB?.fieldId?.toString() === 'Constant' ||
        factorB?.fieldType === 'Constant'
          ? 'Number'
          : getHeaderById(factorB?.fieldId, headers)?.fieldType;
      if (
        factA !== null &&
        factA !== undefined &&
        factB !== null &&
        factB !== undefined
      ) {
        return calculation(
          factA?.toString(),
          factAType,
          factB?.toString(),
          factBType,
          operator,
          factorB?.unit,
          factorB?.includeEndDate
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return getFormulaResult(
      items,
      values,
      headers,
      userProjectRoleId,
      subIndex
    );
  }
}

function getHeaderByName(fieldName, headers = []) {
  // check no headers input
  if (!headers || headers.length <= 0) {
    return null;
  }
  // find header
  const header = headers.find((h) => {
    if (h.fieldType === 'Table') {
      const sHeader = h.subHeaders?.find((sh) => sh.fieldName === fieldName);
      if (sHeader) {
        return sHeader;
      }
    }
    return h.fieldName === fieldName;
  });
  const subHeader = header?.subHeaders?.find(
    (sh) => sh.fieldName === fieldName
  );
  return subHeader ? subHeader : header;
}

function getFormulaFieldValueArray(
  fieldId,
  values = [],
  headers = [],
  userProjectRoleId
) {
  if (!values) {
    return [];
  }
  const result = [];
  values?.forEach((value) => {
    const header = getHeaderById(value.fieldId, headers);
    if (header?.fieldType === 'Table') {
      value?.value?.forEach((subValues, subIndex) => {
        subValues?.values
          ?.filter(
            (subValue) => subValue?.fieldId?.toString() === fieldId?.toString()
          )
          .forEach((subValue) => {
            const subHeader = getHeaderById(subValue?.fieldId, headers);
            if (subHeader?.fieldType === 'Formula') {
              const formula = subHeader?.config?.formula;
              const subResult = getConditionFormulaResult(
                formula,
                values,
                values,
                headers,
                userProjectRoleId,
                subIndex
              );
              if (subResult !== null && subResult !== undefined) {
                result.push(Number(subResult));
              } else {
                result.push(Number(0));
              }
            } else {
              result.push(Number(subValue?.value));
            }
          });
      });
    }
  });
  return result;
}

export function getConditionFormulaResult(
  formulaGroups = [],
  subValues = [],
  values = [],
  headers = [],
  userProjectRoleId,
  subIndex?
) {
  if (!formulaGroups) {
    return null;
  }
  let result = null;
  const resultFunc = (formulaGroup) => {
    result = getFormulaResult(
      formulaGroup,
      subValues,
      headers,
      userProjectRoleId,
      subIndex
    );
  };
  const matchConditionFormulaGroups = formulaGroups.filter((formulaGroup) =>
    checkConditionState(
      formulaGroup?.condition,
      headers,
      values,
      userProjectRoleId,
      subIndex
    )
  );
  const elseConditionFormulaGroup = formulaGroups.find(
    (formulaGroup) => formulaGroup?.condition?.elseTo
  );
  if (
    Array.isArray(matchConditionFormulaGroups) &&
    matchConditionFormulaGroups.length > 0
  ) {
    // for multi conditions return true, only get the first match result
    const matchConditionFormulaGroup = matchConditionFormulaGroups[0];
    resultFunc(matchConditionFormulaGroup);
  } else if (!!elseConditionFormulaGroup) {
    // if else case matched
    resultFunc(elseConditionFormulaGroup);
  }
  return result;
}

function calculationSum(values = []) {
  let sumValue = 0;
  values.forEach((value) => (sumValue += value));
  return sumValue;
}

function calculationCount(values = []) {
  if (!values) {
    return 0;
  }
  return values.length;
}

function calculationAverage(values = []) {
  if (!values || values.length <= 0) {
    return 0;
  }
  return calculationSum(values) / calculationCount(values);
}

function getFormulaFieldValue(
  fieldId,
  values = [],
  headers = [],
  userProjectRoleId,
  subIndex?
) {
  if (!values) {
    return null;
  }
  let result = null;
  values?.forEach((value) => {
    const header = getHeaderById(value?.fieldId, headers);
    if (value?.fieldId?.toString() === fieldId?.toString()) {
      if (header?.fieldType === 'Number') {
        // check number value is not null and not undefined and not empty string
        result =
          value?.value !== null &&
          value?.value !== undefined &&
          value?.value !== ''
            ? Number(value.value)
            : null;
      } else if (header?.fieldType === 'DateTime') {
        result = value?.value as Date;
      } else if (header?.fieldType === 'Formula') {
        const formulaGroup = header?.config?.formula;
        result = getConditionFormulaResult(
          formulaGroup,
          values,
          values,
          headers,
          userProjectRoleId,
          subIndex
        );
      }
    } else if (header?.fieldType === 'Table') {
      const tableValues = value?.value && value?.value[subIndex];
      tableValues?.values
        ?.filter(
          (subValue) => subValue?.fieldId?.toString() === fieldId?.toString()
        )
        .forEach((subValue) => {
          const subHeader = getHeaderById(subValue.fieldId, headers);
          if (subHeader?.fieldType === 'Number') {
            result = Number(subValue?.value);
          } else if (subHeader?.fieldType === 'DateTime') {
            result = subValue?.value;
          } else if (subHeader?.fieldType === 'Formula') {
            const formulaGroup = subHeader?.config?.formula;
            result = getConditionFormulaResult(
              formulaGroup,
              tableValues?.values,
              values,
              headers,
              userProjectRoleId,
              subIndex
            );
          }
        });
    }
  });
  return result;
}

function calculation(
  factA,
  typeA,
  factB,
  typeB,
  operator,
  unitB,
  includeEndDate
) {
  let result = null;
  if (typeA === 'Number') {
    const numA = Number(factA);
    const numB = Number(factB);
    if (operator === 'plus') {
      result = numA + numB;
    } else if (operator === 'minus') {
      result = numA - numB;
    } else if (operator === 'multiply') {
      result = numA * numB;
    } else if (operator === 'divide') {
      result = numB === 0 ? NaN : numA / numB;
    }
  } else if (typeA === 'DateTime') {
    const dateA = moment(new Date(factA));
    if (typeB === 'Number' || typeB === 'Constant') {
      const numB = Number(factB);
      result = calculationWifDate(dateA, operator, numB, unitB);
    } else if (typeB === 'DateTime') {
      const dateB = moment(new Date(factB));
      if (operator === 'minus') {
        result = dateA.diff(dateB, 'days', true) + (includeEndDate ? 1 : 0);
      }
    }
  }
  return result;
}

function calculationWifDate(dateA, operator, numB, unitB) {
  let hourTimes = numB;
  let unit = unitB;
  if (numB % 1 !== 0) {
    unit = 'hours';
    hourTimes = moment.duration(numB, unitB).asHours();
  }
  let result = null;
  if (operator === 'plus') {
    result = dateA.add(hourTimes, unit).toDate();
  } else if (operator === 'minus') {
    result = dateA.subtract(hourTimes, unit).toDate();
  }
  return result;
}

export function checkProjectRoleCondition(condition, userProjectRoleId) {
  if (!condition) {
    return false;
  }
  return condition.projectRoleId.toString() === userProjectRoleId?.toString();
}

export function checkFieldEmptyCondition(
  condition,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?
) {
  if (!condition) {
    return false;
  }
  const refField = getHeaderById(condition.fieldId, headers);
  const refValue = getValueByFieldId(
    condition.fieldId,
    headers,
    values,
    userProjectRoleId,
    subIndex
  )?.value;
  let result = null;
  if (refField?.fieldType === 'AutoId') {
    const autoIdValue = refValue;
    if (!autoIdValue || (!autoIdValue.prefix && !autoIdValue.value)) {
      result = null;
    } else {
      result = `${autoIdValue.prefix}${autoIdValue.value}`;
    }
  } else if (
    refField?.fieldType === 'Image' ||
    refField?.fieldType === 'File'
  ) {
    result = refValue?.fileId;
  } else if (refField?.fieldType === 'Formula') {
    result = getConditionFormulaResult(
      refField?.config?.formula,
      values,
      values,
      headers,
      userProjectRoleId,
      subIndex
    );
  } else if (refField?.fieldType === 'Set') {
    const setOptions = refField?.config?.options ? refField.config.options : [];
    const allowOther = refField?.config?.allowOther;
    const selectedOption = setOptions.find(
      (option) => refValue.toString() === option._id.toString()
    );
    result = selectedOption?.value
      ? selectedOption.value
      : allowOther
      ? refValue
      : null;
  } else {
    result = refValue;
  }
  if (condition.isEmpty) {
    return result === null || result === undefined || result === '';
  } else {
    return result !== null && result !== undefined && result !== '';
  }
}

export function checkConditionNumber(refValue, operator, value) {
  // check ref value
  if (refValue === null || refValue === undefined) {
    return false;
  }
  // check operator
  if (!operator) {
    return false;
  }
  // check condition value
  if (value === null || value === undefined) {
    return false;
  }

  if (operator === '=') {
    return (
      !isNaN(Number(refValue)) &&
      !isNaN(Number(value)) &&
      Number(refValue) === Number(value)
    );
  } else if (operator === '<') {
    return (
      !isNaN(Number(refValue)) &&
      !isNaN(Number(value)) &&
      Number(refValue) < Number(value)
    );
  } else if (operator === '<=') {
    return (
      !isNaN(Number(refValue)) &&
      !isNaN(Number(value)) &&
      Number(refValue) <= Number(value)
    );
  } else if (operator === '>') {
    return (
      !isNaN(Number(refValue)) &&
      !isNaN(Number(value)) &&
      Number(refValue) > Number(value)
    );
  } else if (operator === '>=') {
    return (
      !isNaN(Number(refValue)) &&
      !isNaN(Number(value)) &&
      Number(refValue) >= Number(value)
    );
  } else {
    return false;
  }
}

export function checkConditionDateTime(
  refValue,
  operator,
  value,
  dateType = 'dateTimeLocal'
) {
  // check ref value
  if (!refValue) {
    return false;
  }
  // check operator
  if (!operator) {
    return false;
  }
  // check condition value
  if (!value) {
    return false;
  }
  const refDate = apiDateToMomentDate(refValue, dateType);
  const valueDate = apiDateToMomentDate(value, dateType);

  if (operator === '=') {
    return valueDate.isSame(refDate);
  } else if (operator === '<') {
    return refDate.isBefore(valueDate);
  } else if (operator === '<=') {
    return refDate.isSameOrBefore(valueDate);
  } else if (operator === '>') {
    return refDate.isAfter(valueDate);
  } else if (operator === '>=') {
    return refDate.isSameOrAfter(valueDate);
  } else {
    return false;
  }
}

export function checkConditionSet(
  refValue,
  operator,
  value,
  options = [],
  allowOthers = false
) {
  // check ref value
  if (!refValue) {
    return false;
  }
  // check operator
  if (!operator) {
    return false;
  }
  // check condition value
  if (!value) {
    return false;
  }

  const refOption = options?.find(
    (option) => option._id?.toString() === refValue?.toString()
  );
  const ref = !refOption && allowOthers ? refValue : refOption?.value;

  if (operator === '=') {
    return ref === value;
  } else if (operator === '!=') {
    return ref !== value;
  } else {
    return false;
  }
}

export function checkConditionBoolean(refValue, operator, value) {
  // check operator
  if (!operator) {
    return false;
  }

  if (operator === '=') {
    return Boolean(refValue) === Boolean(value);
  } else {
    return false;
  }
}

/**
 * Check Condition in Formula Type
 * @param refFormula document formula field config
 * @param operator condition operator
 * @param value condition setting value
 * @param headers all document field headers
 * @param values selected record values
 * @param userProjectRoleId current user project role id for project role condition checking (if any)
 * @param subIndex (optional) sub table record index
 */
export function checkConditionFormula(
  refFormula,
  operator,
  value,
  headers = [],
  values = [],
  userProjectRoleId,
  subIndex?
) {
  // check formula group
  if (!refFormula) {
    return false;
  }
  let refResult = null;
  const resultFunc = (formulaGroup) => {
    calculateType = getResultTypeFromFormulaGroup(formulaGroup, headers);
    const result = getFormulaResult(
      formulaGroup,
      values,
      headers,
      userProjectRoleId
    );
    if (result !== null && result !== undefined) {
      refResult = result?.toString();
    }
  };

  let calculateType = null;
  const matchConditionFormulaGroups = refFormula.filter((formulaGroup) =>
    checkConditionState(
      formulaGroup?.condition,
      headers,
      values,
      userProjectRoleId,
      subIndex
    )
  );
  const elseConditionFormulaGroup = refFormula.find(
    (formulaGroup) => formulaGroup?.condition?.elseTo
  );
  if (
    Array.isArray(matchConditionFormulaGroups) &&
    matchConditionFormulaGroups.length > 0
  ) {
    // for multi conditions return true, only get the first match result
    const matchConditionFormulaGroup = matchConditionFormulaGroups[0];
    resultFunc(matchConditionFormulaGroup);
  } else {
    // if else case matched
    resultFunc(elseConditionFormulaGroup);
  }
  if (calculateType === 'Number') {
    return checkConditionNumber(refResult, operator, value);
  } else {
    return checkConditionDateTime(refResult, operator, value, calculateType);
  }
}

export function checkConditionAutoId(refValue, operator, value) {
  // check ref value
  if (!refValue) {
    return false;
  }
  // check operator
  if (!operator) {
    return false;
  }
  // check condition value
  if (!value) {
    return false;
  }

  if (operator === '=') {
    return refValue?.prefix === value;
  } else {
    return false;
  }
}

export function checkConditionOther(refValue, operator, value) {
  // check ref value
  if (!refValue) {
    return false;
  }
  // check operator
  if (!operator) {
    return false;
  }
  // check condition value
  if (!value) {
    return false;
  }

  if (operator === '=') {
    return refValue?.toString() === value?.toString();
  } else {
    return false;
  }
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

export function getResultTypeFromFormulaGroup(formulaGroup, headers = []) {
  const items = formulaGroup?.items;
  if (!items) {
    return null;
  }
  if (Array.isArray(items)) {
    const factorA = items[0];
    const operator = items[1];
    const factorB = items[2];
    if (operator === 'sum' || operator === 'average' || operator === 'count') {
      // Number
      return 'Number';
    } else if (
      operator === 'plus' ||
      operator === 'minus' ||
      operator === 'multiply' ||
      operator === 'divide'
    ) {
      const factorAType = getHeaderTypeByIdInFormula(factorA?.fieldId, headers);
      const factorBType = getHeaderTypeByIdInFormula(factorB?.fieldId, headers);
      if (factorAType === null || factorBType === null) {
        return null;
      }
      if (factorAType === 'Number' && factorBType === 'Number') {
        // Number + Number => Number
        // Number - Number => Number
        // Number * Number => Number
        // Number / Number => Number
        return 'Number';
      } else if (
        (factorAType === 'DateTime' &&
          (operator === 'plus' || operator === 'minus') &&
          (factorBType === 'Number' || (factorBType as any) === 'Constant')) ||
        (factorAType === 'Number' &&
          operator === 'plus' &&
          factorBType === 'DateTime')
      ) {
        // Date Time + Number => Date Time
        // Date Time - Number => Date Time
        // Number + Date Time => Date Time
        if (factorAType === 'DateTime') {
          const factorAHeader = getHeaderById(factorA?.fieldId, headers);
          return factorAHeader?.config?.dateType;
        } else if (factorBType === 'DateTime') {
          const factorBHeader = getHeaderById(factorB?.fieldId, headers);
          return factorBHeader?.config?.dateType;
        }
        return null;
      } else if (
        factorAType === 'DateTime' &&
        operator === 'minus' &&
        factorBType === 'DateTime'
      ) {
        // Date Time - Date Time => Number
        return 'Number';
      } else {
        // Number - Date Time => NA
        // Date Time + Date Time => NA
        return null;
      }
    } else {
      return null;
    }
  } else {
    return getResultTypeFromFormulaGroup(items, headers);
  }
}

export function getHeaderTypeByIdInFormula(fieldId, headers = []) {
  if (fieldId?.toString() === 'Constant') {
    return 'Number';
  }
  const header = getHeaderById(fieldId, headers);
  return header?.fieldType;
}
