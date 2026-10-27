export type ConfigType = {
  projectName: string;
  crypto: ConfigCryptoType;
  api: ConfigApiType;
};

export type ConfigCryptoType = {
  namedCurve: 'P-384' | 'P-256'; // P-384 / P-256
  publicKeyApi: {
    url: string; // 取得前後端通訊用金鑰 API
    response: object; // 取得前後端通訊用金鑰 API Response
    publicKeyColumn: string; // PublicKey 對應 Response 的欄位 ex "tranrs.publicKey"
  };
  request: {
    header: {
      publicKey: string;
      version: string;
    };
  };
  response: {
    needCryptoColumn: string;
    cryptoColumn: string;
    replaceAll: boolean;
  };
};

export type ConfigApiType = {
  default: Array<ApiResponseType>;
  success: Array<ApiResponseType>;
  noData: Array<ApiResponseType>;
  error: Array<ApiResponseType>;
  schema: Array<ApiResponseType>;
};

export type ApiResponseType = {
  id: number;
  label: string;
  isChecked: boolean;
  response: object;
};
