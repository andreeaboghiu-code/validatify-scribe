import { DataRecord, ValidationError } from "@/types/data";

export function validateDataRecord(row: any, index: number): { record?: DataRecord; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  // Validate product_id
  const product_id = parseInt(row.product_id);
  if (isNaN(product_id)) {
    errors.push({
      row: index,
      field: 'product_id',
      message: 'Product ID must be a valid number',
      value: row.product_id
    });
  }
  
  // Validate product_name
  if (!row.product_name || typeof row.product_name !== 'string' || row.product_name.trim() === '') {
    errors.push({
      row: index,
      field: 'product_name',
      message: 'Product name is required',
      value: row.product_name
    });
  }
  
  // Validate price
  const price = parseFloat(row.price);
  if (isNaN(price)) {
    errors.push({
      row: index,
      field: 'price',
      message: 'Price must be a valid number',
      value: row.price
    });
  } else if (price < 0) {
    errors.push({
      row: index,
      field: 'price',
      message: 'Price must be positive',
      value: price
    });
  }
  
  // Validate category
  if (!row.category || typeof row.category !== 'string' || row.category.trim() === '') {
    errors.push({
      row: index,
      field: 'category',
      message: 'Category is required',
      value: row.category
    });
  }
  
  if (errors.length === 0) {
    return {
      record: {
        product_id,
        product_name: row.product_name.trim(),
        price,
        category: row.category.trim()
      },
      errors: []
    };
  }
  
  return { errors };
}

export function validateCsvData(data: any[]): { valid: DataRecord[]; errors: ValidationError[] } {
  const valid: DataRecord[] = [];
  const allErrors: ValidationError[] = [];
  
  data.forEach((row, index) => {
    const { record, errors } = validateDataRecord(row, index + 1);
    if (record) {
      valid.push(record);
    }
    allErrors.push(...errors);
  });
  
  return { valid, errors: allErrors };
}