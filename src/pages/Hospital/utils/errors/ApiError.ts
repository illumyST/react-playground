export type ApiErrorInfo<TParams = unknown, TContent = unknown> = {
  apiPath: string;
  reason?: string;
  returnCode?: string;
  params?: TParams;
  content?: TContent;
  systemTime?: string;
  description?: string;
};

export default class ApiError<TParams = unknown, TContent = unknown> extends Error {
  readonly _tag = 'ApiError';

  readonly apiPath: string;

  readonly url: string;

  readonly returnCode?: string;

  readonly params?: TParams;

  readonly content?: TContent;

  readonly systemTime?: string;

  readonly time: string;

  readonly description?: string;

  // ApiError 是跨 API client、ErrorBoundary、Grafana log 共用的錯誤契約。
  constructor(info: ApiErrorInfo<TParams, TContent>) {
    super(info.reason || 'Unexpected API error');
    this.name = 'ApiError';
    this.apiPath = info.apiPath;
    this.url = window.location.pathname;
    this.returnCode = info.returnCode;
    this.params = info.params;
    this.content = info.content;
    this.systemTime = info.systemTime;
    this.description = info.description;
    this.time = new Date().toISOString();
  }

  // Grafana 與除錯工具使用純物件，避免 Error instance 在序列化時遺失欄位。
  toJsonObj() {
    return {
      errorType: this._tag,
      apiPath: this.apiPath,
      url: this.url,
      returnCode: this.returnCode,
      reason: this.message,
      content: this.content,
      systemTime: this.systemTime,
      time: this.time,
      description: this.description,
      errorStack: this.stack,
    };
  }
}
