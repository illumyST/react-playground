import { faker } from '@faker-js/faker';
import {
  createGeneratorByType,
  createSelectionGenerator,
  createValueConfig,
} from 'struct-fakerator';

type ReturnSuccess<T> = {
  success: boolean;
  returnCode: string;
  returnDesc: string;
  content: T;
};

const validateAndCreate = <T>(factory: () => T, path: string) => {
  try {
    factory();
  } catch (error) {
    throw new Error(`Option error path: ${path}\nReason: ${String(error)}`);
  }

  return createValueConfig(factory);
};

const createStaticValue = (value: unknown) => createValueConfig(() => value);

const returnResponse = <T>(content: T): ReturnSuccess<T> => ({
  success: true,
  returnCode: '0000',
  returnDesc: '執行成功',
  content,
});

// config 是 Admin 定義的動態 schema，option 會依 type 傳給不同的 faker 函式，無法收斂成單一型別
/* eslint-disable @typescript-eslint/no-explicit-any */
const customTypeMatch = (config: any, path: string): any => {
  switch (config?.type) {
    case 'int':
      return validateAndCreate(() => faker.number.int(config.option), path);
    case 'float':
      return validateAndCreate(() => faker.number.float(config.option), path);
    case 'string':
      return validateAndCreate(() => faker.lorem.lines(config.option), path);
    case 'amount':
      return validateAndCreate(() => faker.finance.amount(config.option), path);
    case 'currencyCode':
      return validateAndCreate(() => faker.finance.currencyCode(), path);
    case 'currencySymbol':
      return validateAndCreate(() => faker.finance.currencySymbol(), path);
    case 'email':
      return validateAndCreate(() => faker.internet.email(config.option), path);
    case 'name':
      return validateAndCreate(() => faker.person.fullName(config.option), path);
    case 'date':
      return validateAndCreate(() => faker.date.anytime(config.option), path);
    case 'select':
      return createSelectionGenerator(config.option);
    case 'static':
      return createStaticValue(config.value);
    default:
      throw new Error(`Unsupported type: ${config?.type}, path: ${path}`);
  }
};

export const genSchemaTools = (config: any) => {
  const content = createGeneratorByType(config, customTypeMatch)();
  return returnResponse(content);
};
/* eslint-enable @typescript-eslint/no-explicit-any */
