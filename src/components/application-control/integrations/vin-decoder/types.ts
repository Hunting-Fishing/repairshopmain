export interface NhtsaResult {
  Variable: string;
  Value: string | null;
}

export interface NhtsaResponse {
  Results: NhtsaResult[];
}