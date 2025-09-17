export interface DataRecord {
  product_id: number;
  product_name: string;
  price: number;
  category: string;
  description?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

export interface ValidationResult {
  valid: DataRecord[];
  errors: ValidationError[];
}