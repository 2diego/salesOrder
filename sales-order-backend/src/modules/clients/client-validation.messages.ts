/**
 * Mensajes de validación de cliente (alta/edición).
 * Mantener textos idénticos a `src/constants/clientValidationMessages.ts` en el frontend.
 */
export const CLIENT_VALIDATION_MESSAGES = {
  CITY_REQUIRED: 'La ciudad es obligatoria',
  CITY_MUST_BE_TEXT: 'La ciudad debe ser texto',
  CITY_NO_ABBREVIATIONS: 'La ciudad debe escribirse sin abreviaturas',
  PROVINCE_REQUIRED: 'La provincia es obligatoria',
  PROVINCE_MUST_BE_TEXT: 'La provincia debe ser texto',
  PROVINCE_FROM_LIST: 'La provincia debe seleccionarse de la lista',
} as const;
