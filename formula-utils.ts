import { ObjectId } from 'bson';
import * as moment from 'moment';
import { dateTimeValueToStr } from './utils';

export function getFormulaHeaderById(_id, headers) {
  // Not Headers Input
  if (!headers || (headers && headers.length <= 0)) {
    return null;
  }
  // Empty ID
  if (!_id) {
    return null;
  }
  const _header = headers.find((header) => {
    if (header.fieldType === 'Table') {
      const sHeader =
        header.subHeaders &&
        header.subHeaders.find(
          (sh) =>
            sh._id.toHexString() ===
            (_id instanceof ObjectId ? _id.toHexString() : _id)
        );
      if (sHeader) {
        return sHeader;
      }
    }
    return (
      header._id.toHexString() ===
      (_id instanceof ObjectId ? _id.toHexString() : _id)
    );
  });
  const subHeader =
    _header &&
    _header.subHeaders &&
    _header.subHeaders.find(
      (sh) =>
        sh._id.toHexString() ===
        (_id instanceof ObjectId ? _id.toHexString() : _id)
    );
  if (subHeader) {
    return subHeader;
  } else {
    return _header;
  }
}

export function getFormulaFieldValue(
  fieldId,
  headers,
  values,
  tableIndex
): { result; calculationDateType } {
  const header = getFormulaHeaderById(fieldId, headers);
  // Header Not Found
  if (!header) {
    return null;
  }
  // Values Not Found
  if (!values) {
    return null;
  }
  const parentHeader = headers.find(
    (h) =>
      h.subHeaders &&
      h.subHeaders.find(
        (sh) => sh._id.toHexString() === header._id.toHexString()
      )
  );
  let result: number | Date = null;
  let calculationDateType;
  if (parentHeader) {
    // find header and match table row by tableIndex
    const tableValues = values.find(
      (value) =>
        value.fieldId.toHexString() ===
        (parentHeader && parentHeader._id.toHexString())
    );
    const subRecordValues =
      tableValues && tableValues.value && tableValues.value[tableIndex];
    const subValues = subRecordValues && subRecordValues.values;
    const formulaValue =
      subValues &&
      subValues.find(
        (subValue) =>
          subValue.fieldId.toHexString() === header._id.toHexString()
      );
    if (formulaValue) {
      if (header.fieldType === 'Number') {
        result = Number(formulaValue.value);
      } else if (header.fieldType === 'DateTime') {
        result = formulaValue.value as Date;
        // Update Date Type for display
        calculationDateType = header.config && header.config['dateType'];
      } else if (header.fieldType === 'Formula') {
        const value = calculateFormula(
          header.config.formula,
          headers,
          values,
          tableIndex
        );
        result = Number(value);
      }
    }
  } else {
    values
      .filter(
        (value) =>
          value.fieldId.toHexString() ===
          (fieldId instanceof ObjectId ? fieldId.toHexString() : fieldId)
      )
      .forEach((value) => {
        if (header.fieldType === 'Number') {
          result = Number(value.value);
        } else if (header.fieldType === 'DateTime') {
          result = value.value as Date;
          // Update Date Type for display
          calculationDateType = header.config && header.config['dateType'];
        } else if (header.fieldType === 'Formula') {
          if (value) {
            const value = calculateFormula(
              header.config.formula,
              headers,
              values
            );
            result = Number(value);
          }
        }
      });
  }
  return { result, calculationDateType };
}

export function calculateFormula(
  formula,
  headers,
  values,
  tableIndex?: number
) {
  let calResult = '';
  let calculatedValue;
  let calculationDateType;
  formula.forEach((formulaGroup) => {
    const result = caclulateFormulaWithFormulaGroup(
      formulaGroup,
      headers,
      values,
      tableIndex
    );
    if (result && result.tempResult) {
      calResult += result.tempResult;
      calculationDateType = result.calculationDateType;
    }
  });

  // ! handle datetime value
  if (
    // !this.displayUnit &&
    calculationDateType
  ) {
    let result;
    let d = moment(calResult);
    if (
      calculationDateType === 'dateTimeUtc' ||
      calculationDateType === 'timeOnly' ||
      calculationDateType === 'dateOnly'
    ) {
      d = d.subtract(d.utcOffset(), 'minutes');
      result = d ? dateTimeValueToStr(d.format(), calculationDateType) : '';
      calculatedValue = result !== 'Invalid date' ? result : '';
    } else {
      calculatedValue =
        calculationDateType === 'Days'
          ? calResult + ' ' + calculationDateType
          : '';
    }
  } else {
    calculatedValue = calResult ? calResult.toString() : '';
  }

  return calculatedValue ? calculatedValue : calResult;
}

export function caclulateFormulaWithFormulaGroup(
  formulaGroup,
  headers,
  values,
  tableIndex: number
): { tempResult: number | Date; calculationDateType } {
  // Check Formula Group
  if (!formulaGroup) {
    return null;
  }
  // Check Formula Group Items
  const items = formulaGroup.items;
  if (!items) {
    return null;
  }
  if (items instanceof Array) {
    // Document Formula Items
    let tempResult = null;
    let calculationDateType;

    for (let index = 0; index < items.length; index += 2) {
      const factorA = tempResult ? tempResult : items[index];
      const operator = items[index + 1];
      if (operator === 'sum') {
        const factors = getFormulaFieldValueArray(
          factorA.fieldId,
          headers,
          values
        );
        tempResult = calculationSum(factors);
      } else if (operator === 'average') {
        const factors = getFormulaFieldValueArray(
          factorA.fieldId,
          headers,
          values
        );
        tempResult = calculationAverage(factors);
      } else if (operator === 'count') {
        const factors = getFormulaFieldValueArray(
          factorA.fieldId,
          headers,
          values
        );
        tempResult = calculationCount(factors);
      } else if (
        operator === 'plus' ||
        operator === 'minus' ||
        operator === 'multiply' ||
        operator === 'divide'
      ) {
        const factorB = items[index + 2];
        let factA;
        let factAType;
        let factB;
        let factBType;
        let factBUnit;
        let factBIncludeEndDate: boolean;
        if (instanceOfFieldFactor(factorA)) {
          // From Field
          const formulaValue = getFormulaFieldValue(
            factorA.fieldId,
            headers,
            values,
            tableIndex
          );
          factA = formulaValue.result;
          factAType = typeof factA === 'number' ? 'Number' : 'DateTime';
          calculationDateType = formulaValue.calculationDateType
            ? formulaValue.calculationDateType
            : calculationDateType;
        } else {
          // From Previous calc
          factAType = typeof factorA === 'number' ? 'Number' : 'DateTime';
          factA = factorA;
        }
        factBUnit = factorB.unit;
        factBIncludeEndDate = factorB.includeEndDate;
        if (instanceOfFieldFactor(factorB)) {
          const formulaValue = getFormulaFieldValue(
            factorB.fieldId,
            headers,
            values,
            tableIndex
          );
          factB = formulaValue.result;
          factBType = typeof factB === 'number' ? 'Number' : 'DateTime';
          calculationDateType = formulaValue.calculationDateType
            ? formulaValue.calculationDateType
            : calculationDateType;
        } else {
          factB = factorB.constant;
          factBType = 'Number';
        }
        if (factA && factB) {
          tempResult = calculate(
            factA.toString(),
            factAType,
            factB.toString(),
            factBType,
            operator,
            factBUnit,
            factBIncludeEndDate
          );
        }
        if (factAType === 'DateTime' && factBType === 'DateTime') {
          calculationDateType = 'Days';
        }
      }
    }
    return { tempResult, calculationDateType };
  } else {
    // Formula Group
    return caclulateFormulaWithFormulaGroup(items, headers, values, tableIndex);
  }
}

export function getFormulaFieldValueArray(
  fieldId: ObjectId,
  headers,
  values
): number[] {
  const result: number[] = [];
  values.forEach((value) => {
    // Get Header
    const header = getFormulaHeaderById(value.fieldId, headers);
    // Check Header Type is Table
    if (header && header.fieldType === 'Table') {
      // Loop Sub Records
      value.value.forEach((subValues) => {
        // Loop Sub Record Fields
        subValues.values
          .filter(
            (subValue) =>
              subValue.fieldId.toHexString() ===
              (fieldId instanceof ObjectId ? fieldId.toHexString() : fieldId)
          )
          .forEach((subValue) => result.push(Number(subValue.value)));
      });
    }
  });
  return result;
}

export function calculationSum(values: number[]): number {
  let sumValue = 0;
  values.forEach((value) => (sumValue += value));
  return sumValue;
}

export function calculationAverage(values: number[]): number {
  if (!values || (values && values.length === 0)) {
    // Cannot Do the Division of ZERO
    return 0;
  }
  let averageValue = 0;
  values.forEach((value) => (averageValue += value));
  averageValue /= values.length;
  return averageValue;
}

export function calculationCount(values: number[]): number {
  // No Values
  if (!values) {
    return 0;
  }
  // Count of Values
  return values.length;
}

export function instanceOfFieldFactor(object: any): boolean {
  return (
    object instanceof Object &&
    'fieldId' in object &&
    object['fieldId'] !== 'Constant'
  );
}

export function calculate(
  factA: string,
  typeA,
  factB: string,
  typeB,
  operator,
  unitB,
  includeEndDate: boolean
): number | Date {
  let result: number | Date = null;
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
    const dateA = moment(factA);
    if (typeB === 'Number' || typeB === 'Constant') {
      const numB = Number(factB);
      if (operator === 'plus') {
        result = dateA.add(numB, unitB).toDate();
      } else if (operator === 'minus') {
        result = dateA.subtract(numB, unitB).toDate();
      }
    } else if (typeB === 'DateTime') {
      const dateB = moment(factB);
      if (operator === 'minus') {
        // ref: https://momentjs.com/docs/#/displaying/difference/
        // const duration = moment.duration(dateA.diff(dateB));
        // result = duration.asMilliseconds() / (1000 * 60 * 60 * 24);
        result = dateA.diff(dateB, 'days') + (includeEndDate ? 1 : 0);
      }
    }
  }
  return result;
}
