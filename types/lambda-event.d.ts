type ObjectOf<T> = {
  [key: string]: T;
};

declare type LambdaEvent = {
  body: string;
  headers: ObjectOf<string>;
  isBase64Encoded: boolean;
  multiValueHeaders: ObjectOf<string[]>;
  statusCode: number;
};
