import { getConvertedTableValues, getConvertedValueObject } from '../convert';
import { record, workflow, projectUsers } from '../data/data2';

describe('First Test', () => {
  it('expect true', () => {
    expect(true).toBeTruthy();
  });
});

describe('Convert Values', () => {
  const recordValues = record.values;
  let mappedHeaderValue = {};

  beforeAll(() => {
    record.values.forEach((value) => {
      const header = workflow.headers.find(
        (h) => h._id.toHexString() === value.fieldId.toHexString()
      );
      mappedHeaderValue[value.__t] = {
        header,
        value,
      };
    });
  });

  xdescribe('Single Value', () => {
    it('Convert String', () => {
      const { header, value } = mappedHeaderValue['String'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 1',
        displayValue: 'sasds',
        String: 'sasds',
      });
    });

    it('Convert LongText', () => {
      const { header, value } = mappedHeaderValue['LongText'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 2',
        displayValue:
          'asdasdsad\nasdsadasda\nasdasdsadas\nasdsadasd\nasdasdsad\nasdasdas\nasdasdsa',
        LongText:
          'asdasdsad\nasdsadasda\nasdasdsadas\nasdsadasd\nasdasdsad\nasdasdas\nasdasdsa',
      });
    });

    it('Convert Number', () => {
      const { header, value } = mappedHeaderValue['Number'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 3',
        displayValue: '1232123432123',
        Number: 1232123432123,
      });
    });

    it('Convert DateTime', () => {
      const { header, value } = mappedHeaderValue['DateTime'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 4',
        displayValue: '2022-01-19',
        DateTime: new Date('2022-01-19T00:00:00.000Z'),
      });
    });

    it('Convert Boolean', () => {
      const { header, value } = mappedHeaderValue['Boolean'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 5',
        displayValue: 'true',
        Boolean: true,
      });
    });

    it('Convert Set', () => {
      const { header, value } = mappedHeaderValue['Set'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 6',
        displayValue: 'test1',
        Set: '61e7e074a6d0ad43400a21cd',
      });
    });

    it('Convert User', () => {
      const { header, value } = mappedHeaderValue['User'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 7',
        displayValue: 'kevinlai',
        User: '5cb3ebf7b06cab0f1af988f3',
      });
    });

    it('Convert FilePath', () => {
      const { header, value } = mappedHeaderValue['FilePath'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 10',
        displayValue: '213312/sadfs',
        FilePath: '213312/sadfs',
      });
    });

    it('Convert Url', () => {
      const { header, value } = mappedHeaderValue['Url'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 11',
        displayValue: 'google.com',
        Url: 'google.com',
      });
    });

    it('Convert AutoId', () => {
      const { header, value } = mappedHeaderValue['AutoId'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 12',
        displayValue: 'a-001',
        AutoId: {
          prefix: 'a-',
          value: 1,
        },
      });
    });

    it('Convert Formula', () => {
      const { header, value } = mappedHeaderValue['Formula'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 23',
        displayValue: '',
        Formula: '1232123432118',
      });
    });
  });

  xdescribe('Multiple Value', () => {
    it('Convert Multi-String', () => {
      const { header, value } = mappedHeaderValue['Multi-String'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 13',
        displayValue: ['nbvcvb', 'ererewert'],
        String: ['nbvcvb', 'ererewert'],
      });
    });

    it('Convert Multi-LongText', () => {
      const { header, value } = mappedHeaderValue['Multi-LongText'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 14',
        displayValue: [
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
        ],
        LongText: [
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
          'gfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsggfsfdgeds\ngfdfsd\ngfdfdsggdsdfsg',
        ],
      });
    });

    it('Convert Multi-Number', () => {
      const { header, value } = mappedHeaderValue['Multi-Number'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 15',
        displayValue: ['111', '2222', '3333'],
        Number: [111, 2222, 3333],
      });
    });

    it('Convert Multi-DateTime', () => {
      const { header, value } = mappedHeaderValue['Multi-DateTime'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 16',
        displayValue: ['2022-01-19', '2022-01-20', '2022-01-20', '2022-01-21'],
        DateTime: [
          new Date('2022-01-19T00:00:00.000Z'),
          new Date('2022-01-20T00:00:00.000Z'),
          new Date('2022-01-20T00:00:00.000Z'),
          new Date('2022-01-21T00:00:00.000Z'),
        ],
      });
    });

    it('Convert Multi-Set', () => {
      const { header, value } = mappedHeaderValue['Multi-Set'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 17',
        displayValue: ['test4', 'test3'],
        Set: ['61e7e098a6d0ad43400a2308', '61e7e098a6d0ad43400a2307'],
      });
    });

    it('Convert Multi-User', () => {
      const { header, value } = mappedHeaderValue['Multi-User'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 18',
        displayValue: ['kevinlai', 'kevinlaibuildit1'],
        User: ['5cb3ebf7b06cab0f1af988f3', '5dfc9550f2743d6d65e8e5a1'],
      });
    });

    it('Convert Multi-FilePath', () => {
      const { header, value } = mappedHeaderValue['Multi-FilePath'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 19',
        displayValue: ['ddd/ddd', 'ccc/ccc'],
        FilePath: ['ddd/ddd', 'ccc/ccc'],
      });
    });

    it('Convert Multi-Url', () => {
      const { header, value } = mappedHeaderValue['Multi-Url'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 20',
        displayValue: ['drow.cloud', 'uat2.drow.cloud'],
        Url: ['drow.cloud', 'uat2.drow.cloud'],
      });
    });

    it('Convert Multi-AutoId', () => {
      const { header, value } = mappedHeaderValue['Multi-AutoId'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 21',
        displayValue: ['b-004', 'b-002', 'b-003'],
        AutoId: [
          {
            prefix: 'b-',
            value: 4,
          },
          {
            prefix: 'b-',
            value: 2,
          },
          {
            prefix: 'b-',
            value: 3,
          },
        ],
      });
    });

    it('Convert Multi-Image', () => {
      const { header, value } = mappedHeaderValue['Multi-Image'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 8',
        displayValue: ['oauth2 drow authentication flow.jpg'],
        Image: [
          {
            fileName: 'oauth2 drow authentication flow',
            fileType: 'jpg',
          },
        ],
      });
    });

    it('Convert Multi-File', () => {
      const { header, value } = mappedHeaderValue['Multi-File'];
      const convertedValue = getConvertedValueObject(
        value,
        record.values,
        header,
        undefined,
        undefined,
        projectUsers
      );

      expect(convertedValue).toEqual({
        fieldName: 'Field 9',
        displayValue: ['34c8e7a6-9e53-4246-9a62-25dff54f09bf.pdf'],
        File: [
          {
            fileName: '34c8e7a6-9e53-4246-9a62-25dff54f09bf',
            fileType: 'pdf',
          },
        ],
      });
    });
  });

  describe('Table Subvalues', () => {
    const result = {
      Table: [
        {
          '61e7e318a6d0ad43400a2b04': {
            fieldName: 'Sub Field 0',
            displayValue: 'adgghfdfsn',
            String: 'adgghfdfsn',
          },
          '61e7e318a6d0ad43400a2b05': {
            fieldName: 'Sub Field 1',
            displayValue: 'asfgfafdsdgsd\ndfasdsdsfs\nadfgdsfbgdas',
            LongText: 'asfgfafdsdgsd\ndfasdsdsfs\nadfgdsfbgdas',
          },
          '61e7e318a6d0ad43400a2b06': {
            fieldName: 'Sub Field 2',
            displayValue: '43565435',
            Number: 43565435,
          },
          '61e7e318a6d0ad43400a2b07': {
            fieldName: 'Sub Field 3',
            displayValue: '2022-01-22',
            DateTime: new Date('2022-01-22T00:00:00.000Z'),
          },
          '61e7e318a6d0ad43400a2b08': {
            fieldName: 'Sub Field 4',
            displayValue: 'true',
            Boolean: true,
          },
          '61e7e318a6d0ad43400a2b09': {
            fieldName: 'Sub Field 5',
            displayValue: 'test3',
            Set: '61e7e318a6d0ad43400a2b3f',
          },
          '61e7e318a6d0ad43400a2b0a': {
            fieldName: 'Sub Field 6',
            displayValue: 'kevinlai',
            User: '5cb3ebf7b06cab0f1af988f3',
          },
          '61e7e318a6d0ad43400a2b0b': {
            fieldName: 'Sub Field 7',
            displayValue: 'oauth2 drow authentication flow.jpg',
            Image: {
              fileName: 'oauth2 drow authentication flow',
              fileType: 'jpg',
            },
          },
          '61e7e318a6d0ad43400a2b0c': {
            fieldName: 'Sub Field 8',
            displayValue: 'oauth2 drow authentication flow.jpg',
            File: {
              fileName: 'oauth2 drow authentication flow',
              fileType: 'jpg',
            },
          },
          '61e7e318a6d0ad43400a2b0d': {
            fieldName: 'Sub Field 9',
            displayValue: 'erhtre/erhtrte',
            FilePath: 'erhtre/erhtrte',
          },
          '61e7e318a6d0ad43400a2b0e': {
            fieldName: 'Sub Field 10',
            displayValue: 'drow.cloud',
            Url: 'drow.cloud',
          },
          '61e7e318a6d0ad43400a2b0f': {
            fieldName: 'Sub Field 11',
            displayValue: '',
            Formula: '43565445',
          },
        },
        {
          '61e7e318a6d0ad43400a2b04': {
            fieldName: 'Sub Field 0',
            displayValue: 'dwmjmgjm',
            String: 'dwmjmgjm',
          },
          '61e7e318a6d0ad43400a2b05': {
            fieldName: 'Sub Field 1',
            displayValue: 'nhnhghg\nh\njhfjhf\njf\njf',
            LongText: 'nhnhghg\nh\njhfjhf\njf\njf',
          },
          '61e7e318a6d0ad43400a2b06': {
            fieldName: 'Sub Field 2',
            displayValue: '565',
            Number: 565,
          },
          '61e7e318a6d0ad43400a2b07': {
            fieldName: 'Sub Field 3',
            displayValue: '2022-01-23',
            DateTime: new Date('2022-01-23T00:00:00.000Z'),
          },
          '61e7e318a6d0ad43400a2b08': {
            fieldName: 'Sub Field 4',
            displayValue: 'false',
          },
          '61e7e318a6d0ad43400a2b09': {
            fieldName: 'Sub Field 5',
            displayValue: 'test4',
            Set: '61e7e318a6d0ad43400a2b40',
          },
          '61e7e318a6d0ad43400a2b0a': {
            fieldName: 'Sub Field 6',
            displayValue: 'kevinlaibuildit1',
            User: '5dfc9550f2743d6d65e8e5a1',
          },
          '61e7e318a6d0ad43400a2b0b': {
            fieldName: 'Sub Field 7',
            displayValue: 'guard.jpeg',
            Image: {
              fileName: 'guard',
              fileType: 'jpeg',
            },
          },
          '61e7e318a6d0ad43400a2b0c': {
            fieldName: 'Sub Field 8',
            displayValue: 'guard.jpeg',
            File: {
              fileName: 'guard',
              fileType: 'jpeg',
            },
          },
          '61e7e318a6d0ad43400a2b0d': {
            fieldName: 'Sub Field 9',
            displayValue: 'mmmm',
            FilePath: 'mmmm',
          },
          '61e7e318a6d0ad43400a2b0e': {
            fieldName: 'Sub Field 10',
            displayValue: 'dffdgdgd.com',
            Url: 'dffdgdgd.com',
          },
          '61e7e318a6d0ad43400a2b0f': {
            fieldName: 'Sub Field 11',
            displayValue: '',
            Formula: '575',
          },
        },
      ],
      fieldName: 'Field 22',
    };
    it('Convert Table Subvalues', () => {
      const { header, value } = mappedHeaderValue['Table'];
      const convertedValue = getConvertedTableValues(
        value,
        record.values,
        header,
        undefined,
        projectUsers
      );
      expect(convertedValue).toEqual(result);
    });
  });
});
