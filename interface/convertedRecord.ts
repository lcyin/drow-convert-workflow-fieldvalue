export interface ConvertedRecord {
  referenceId: string;
  documentId: string;
  documentName: string;
  title: string;
  assigneeIds: string[];
  assigneeNames: string[];
  statusId: string;
  statusName: string;
  dueDate: string;
  dueDateType: string;
  lastModifiedBy: string;
  createdBy: string;
  lastModifiedName: string;
  createdName: string;
  createDate: string;
  lastModifyDate: string;
  values: {
    [key: string]: SingleValue | MultiValue | TableValue;
  };
}

export interface ConvertedValue {}

export interface BaseValue {
  fieldName: string;
}
// Todo
// Formula
// Model

export interface BaseSingleValue extends BaseValue {
  fieldName: string;
  displayValue: string;
}

export interface BaseMultiValue extends BaseValue {
  fieldName: string;
  displayValue: string[];
}

// String
export interface StringSingleValue extends BaseSingleValue {
  String: string;
}

export interface StringMultiValue extends BaseSingleValue {
  String: string[];
}

// LongText
export interface LongTextSingleValue extends BaseSingleValue {
  LongText: string;
}

export interface LongTextMultiValue extends BaseSingleValue {
  LongText: string[];
}
// Auto ID

export interface AutoIdObject {
  prefix: string;
  value: number;
}

export interface AutoIdValue extends BaseSingleValue {
  AutoId: AutoIdObject;
}
// Options

export interface SetSingleValue extends BaseSingleValue {
  Set: string;
}
export interface SetMultiValue extends BaseMultiValue {
  Set: string[];
}
// Number

export interface NumberSingleValue extends BaseSingleValue {
  Number: number;
}
// Checkbox

export interface BooleanSingleValue extends BaseSingleValue {
  Boolean: boolean;
}
export interface BooleanMultiValue extends BaseMultiValue {
  Boolean: boolean[];
}
// DateTime

export interface DateTimeSingleValue extends BaseSingleValue {
  DateTime: string;
}

export interface DateTimeMultiValue extends BaseMultiValue {
  DateTime: string[];
}

export interface FileObject {
  fileName: string;
  fileType: string;
}
// File

export interface FileSingleValue extends BaseSingleValue {
  File: FileObject;
}
export interface FileMultiValue extends BaseSingleValue {
  File: FileObject[];
}

// Image
export interface ImageSignleValue extends BaseSingleValue {
  Image: FileObject;
}
export interface ImageMultiValue extends BaseMultiValue {
  Image: FileObject[];
}

// FilePath
export interface FilePathSignleValue extends BaseSingleValue {
  FilePath: string;
}
export interface FilePathMultiValue extends BaseMultiValue {
  FilePath: string[];
}

// Url
export interface UrlSignleValue extends BaseSingleValue {
  Url: string;
}
export interface UrlMultiValue extends BaseMultiValue {
  Url: string[];
}

// User
export interface UserSingleValue extends BaseSingleValue {
  User: string;
}
export interface UserMultiValue extends BaseMultiValue {
  User: string[];
}

export interface SubValue {
  [key: string]:
    | StringSingleValue
    | LongTextSingleValue
    | DateTimeSingleValue
    | SetSingleValue
    | UserSingleValue
    | NumberSingleValue
    | BooleanSingleValue
    | FileSingleValue
    | ImageSignleValue
    | UrlSignleValue
    | FilePathSignleValue;
  // Todo Formula
}
// Table

export interface TableValue {
  Table: SubValue[];
  fieldName: string;
}

export type SingleValue =
  | StringSingleValue
  | LongTextSingleValue
  | AutoIdValue
  | SetSingleValue
  | NumberSingleValue
  | BooleanSingleValue
  | DateTimeSingleValue
  | FileSingleValue
  | UserSingleValue
  | ImageSignleValue
  | UrlSignleValue
  | FilePathSignleValue;
// Todo Model
export type MultiValue = SingleValue[];
