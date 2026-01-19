export enum EntryTypeEnum {
  Barometer = 'barometer',
  CheckboxGroup = 'check-group',
  Date = 'date',
  Number = 'number',
  RadioGroup = 'radio-group',
  Selector = 'selector',
  Text = 'text',
  Textarea = 'text-area',
  TextString = 'text-string',
}

export type SectionId = string;
export type QuestionId = string;
export type AnswerId = string;
export type ValidatorId = string;

export type ValidatorFn = <T>(v: T) => boolean;
export type Answer = Record<AnswerId, string>;
export type Validator = Record<ValidatorId, ValidatorFn>;

export type AndOr = 'and' | 'or' | 'xand' | 'xor';
export type ConditionType = '==' | '!=' | '<=' | '>=' | '<' | '>';
export type ConditionTuplet = [ConditionType, number];
export type LeafCondition = { [key in QuestionId]: ConditionTuplet };
export type Conditions = {
  [key in AndOr]?: Array<LeafCondition | Conditions>;
};

export type Section = {
  id: SectionId;
  name: string;
  updated: number;
  description: string;
  questions: QuestionId[];
};

export type SectionPayload = {
  id: SectionId;
  name: string;
  updated: number;
  description: string;
  questions: QuestionPayload[];
};

export type QuestionCore = {
  id: QuestionId;
  entry: string;
  updated: number;
  answerType?: EntryTypeEnum;
};

export type Question<C extends Conditions | string = Conditions> = QuestionCore & {
  answers: AnswerId[];
  validators: ValidatorId[];
  conditions: C;
};

export type QuestionPayload = QuestionCore & {
  answers: Answer;
  validators: ValidatorId[];
  conditions: string;
};

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}
