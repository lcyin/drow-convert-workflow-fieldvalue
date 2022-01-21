import { getConvertedTableValues, getConvertedValueObject } from '../convert';
import { record, workflow, projectUsers } from '../data/data2';

describe('First Test', () => {
  it('expect true', () => {
    expect(true).toBeTruthy();
  });
});

describe('Convert Values', () => {
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

  describe('Single Value', () => {
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
        fieldId: '61e8c21da6d0ad43400c136a',
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
        fieldId: '61e8c21da6d0ad43400c136b',
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
        fieldId: '61e8c21da6d0ad43400c136c',
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
        fieldId: '61e8c21da6d0ad43400c136d',
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
        fieldId: '61e8c21da6d0ad43400c136e',
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
        fieldId: '61e8c21da6d0ad43400c136f',
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
        fieldId: '61e8c21da6d0ad43400c1370',
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
        fieldId: '61e8c21da6d0ad43400c1375',
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
        fieldId: '61e8c21da6d0ad43400c1376',
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
        fieldId: '61e8c21da6d0ad43400c1377',
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
        displayValue: '1232123432118',
        fieldId: '61e8c21da6d0ad43400c13a4',
        Formula: [
          {
            items: [
              {
                fieldId: '61e7dfeaa6d0ad43400a1f87',
                fieldName: 'Field 3',
                fieldType: 'Number',
                isSub: false,
              },
              'minus',
              {
                fieldId: 'Constant',
                fieldType: 'Constant',
                fieldName: 'Constant',
                isSub: false,
                unit: null,
                constant: 5,
              },
            ],
          },
        ],
      });
    });
  });

  describe('Multiple Value', () => {
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
        fieldId: '61e8c21da6d0ad43400c1379',
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
        fieldId: '61e8c21da6d0ad43400c137a',
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
        fieldId: '61e8c21da6d0ad43400c137b',
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
        fieldId: '61e8c21da6d0ad43400c137c',
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
        fieldId: '61e8c21da6d0ad43400c137d',
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
        fieldId: '61e8c21da6d0ad43400c137e',
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
        fieldId: '61e8c21da6d0ad43400c137f',
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
        fieldId: '61e8c21da6d0ad43400c1380',
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
        fieldId: '61e8c21da6d0ad43400c1381',
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
        fieldId: '61e8c21da6d0ad43400c1371',
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
        fieldId: '61e8c21da6d0ad43400c1373',
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
        [
          {
            fieldName: 'Sub Field 0',
            displayValue: 'adgghfdfsn',
            fieldId: '61e8c1d8a6d0ad43400c0785',
            String: 'adgghfdfsn',
          },
          {
            fieldName: 'Sub Field 1',
            displayValue: 'asfgfafdsdgsd\ndfasdsdsfs\nadfgdsfbgdas',
            fieldId: '61e8c1d8a6d0ad43400c0786',
            LongText: 'asfgfafdsdgsd\ndfasdsdsfs\nadfgdsfbgdas',
          },
          {
            fieldName: 'Sub Field 2',
            displayValue: '43565435',
            fieldId: '61e8c1d8a6d0ad43400c0787',
            Number: 43565435,
          },
          {
            fieldName: 'Sub Field 3',
            displayValue: '2022-01-22',
            fieldId: '61e8c1d8a6d0ad43400c0788',
            DateTime: new Date('2022-01-22T00:00:00.000Z'),
          },
          {
            fieldName: 'Sub Field 4',
            displayValue: 'true',
            fieldId: '61e8c1d8a6d0ad43400c0789',
            Boolean: true,
          },
          {
            fieldName: 'Sub Field 5',
            displayValue: 'test3',
            fieldId: '61e8c1d8a6d0ad43400c078a',
            Set: '61e7e318a6d0ad43400a2b3f',
          },
          {
            fieldName: 'Sub Field 6',
            displayValue: 'kevinlai',
            fieldId: '61e8c1d8a6d0ad43400c078b',
            User: '5cb3ebf7b06cab0f1af988f3',
          },
          {
            fieldName: 'Sub Field 7',
            displayValue: 'oauth2 drow authentication flow.jpg',
            fieldId: '61e8c1d8a6d0ad43400c078c',
            Image: {
              fileName: 'oauth2 drow authentication flow',
              fileType: 'jpg',
            },
          },
          {
            fieldName: 'Sub Field 8',
            displayValue: 'oauth2 drow authentication flow.jpg',
            fieldId: '61e8c1d8a6d0ad43400c078e',
            File: {
              fileName: 'oauth2 drow authentication flow',
              fileType: 'jpg',
            },
          },
          {
            fieldName: 'Sub Field 9',
            displayValue: 'erhtre/erhtrte',
            fieldId: '61e8c1d8a6d0ad43400c0790',
            FilePath: 'erhtre/erhtrte',
          },
          {
            fieldName: 'Sub Field 10',
            displayValue: 'drow.cloud',
            fieldId: '61e8c1d8a6d0ad43400c0791',
            Url: 'drow.cloud',
          },
          {
            fieldName: 'Sub Field 11',
            displayValue: '43565445',
            fieldId: '61e8c1d8a6d0ad43400c0792',
            Formula: [
              {
                items: [
                  {
                    fieldId: '61e7e318a6d0ad43400a2b06',
                    fieldType: 'Number',
                    fieldName: 'Sub Field 2',
                    isSub: true,
                  },
                  'plus',
                  {
                    fieldId: 'Constant',
                    fieldType: 'Constant',
                    fieldName: 'Constant',
                    isSub: false,
                    unit: null,
                    constant: 10,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            fieldName: 'Sub Field 0',
            displayValue: 'dwmjmgjm',
            fieldId: '61e8c1d8a6d0ad43400c0794',
            String: 'dwmjmgjm',
          },
          {
            fieldName: 'Sub Field 1',
            displayValue: 'nhnhghg\nh\njhfjhf\njf\njf',
            fieldId: '61e8c1d8a6d0ad43400c0795',
            LongText: 'nhnhghg\nh\njhfjhf\njf\njf',
          },
          {
            fieldName: 'Sub Field 2',
            displayValue: '565',
            fieldId: '61e8c1d8a6d0ad43400c0796',
            Number: 565,
          },
          {
            fieldName: 'Sub Field 3',
            displayValue: '2022-01-23',
            fieldId: '61e8c1d8a6d0ad43400c0797',
            DateTime: new Date('2022-01-23T00:00:00.000Z'),
          },
          {
            fieldName: 'Sub Field 4',
            displayValue: 'false',
            fieldId: '61e8c1d8a6d0ad43400c0798',
          },
          {
            fieldName: 'Sub Field 5',
            displayValue: 'test4',
            fieldId: '61e8c1d8a6d0ad43400c0799',
            Set: '61e7e318a6d0ad43400a2b40',
          },
          {
            fieldName: 'Sub Field 6',
            displayValue: 'kevinlaibuildit1',
            fieldId: '61e8c1d8a6d0ad43400c079a',
            User: '5dfc9550f2743d6d65e8e5a1',
          },
          {
            fieldName: 'Sub Field 7',
            displayValue: 'guard.jpeg',
            fieldId: '61e8c1d8a6d0ad43400c079b',
            Image: {
              fileName: 'guard',
              fileType: 'jpeg',
            },
          },
          {
            fieldName: 'Sub Field 8',
            displayValue: 'guard.jpeg',
            fieldId: '61e8c1d8a6d0ad43400c079d',
            File: {
              fileName: 'guard',
              fileType: 'jpeg',
            },
          },
          {
            fieldName: 'Sub Field 9',
            displayValue: 'mmmm',
            fieldId: '61e8c1d8a6d0ad43400c079f',
            FilePath: 'mmmm',
          },
          {
            fieldName: 'Sub Field 10',
            displayValue: 'dffdgdgd.com',
            fieldId: '61e8c1d8a6d0ad43400c07a0',
            Url: 'dffdgdgd.com',
          },
          {
            fieldName: 'Sub Field 11',
            displayValue: '575',
            fieldId: '61e8c1d8a6d0ad43400c07a1',
            Formula: [
              {
                items: [
                  {
                    fieldId: '61e7e318a6d0ad43400a2b06',
                    fieldType: 'Number',
                    fieldName: 'Sub Field 2',
                    isSub: true,
                  },
                  'plus',
                  {
                    fieldId: 'Constant',
                    fieldType: 'Constant',
                    fieldName: 'Constant',
                    isSub: false,
                    unit: null,
                    constant: 10,
                  },
                ],
              },
            ],
          },
        ],
      ],
      fieldName: 'Field 22',
      fieldId: '61e7e318a6d0ad43400a2b03',
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
