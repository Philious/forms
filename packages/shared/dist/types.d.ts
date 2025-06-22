export declare enum AnswerTypeEnum {
    RadioButton = "radio-button",
    Barometer = "barometer",
    Text = "text",
    Number = "number",
    Textarea = "text-area",
    Date = "date",
    Dropdown = "drop-down",
    Checkbox = "check-box"
}
export type SectionId = string;
export type QuestionId = string;
export type AnswerId = string;
export type ValidatorId = string;
export type ConditionId = string;
export type ValidatorFn = <T>(v: T) => boolean;
export type ConditionFn = <T>(v: T) => boolean;
export type Answer = Record<AnswerId, string>;
export type Validator = Record<ValidatorId, ValidatorFn>;
export type Condition = Record<ConditionId, ConditionFn>;
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
    answerType?: AnswerTypeEnum;
};
export type Question = QuestionCore & {
    answers: AnswerId[];
    validators: ValidatorId[];
    conditions: ConditionId[];
};
export type QuestionPayload = QuestionCore & {
    answers: Answer;
    validators: ValidatorId[];
    conditions: Condition;
};
export declare enum HttpStatusCode {
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
    NetworkAuthenticationRequired = 511
}
