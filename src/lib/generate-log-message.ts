import { ACTION, AuditLog, ENTITY_TYPE } from '@prisma/client';

export const generateLogMessage = (log: AuditLog) => {
   const { action, entityTitle, entityType } = log;
   const translateEntity = translateEntityType(entityType);

   switch (action) {
      case ACTION.CREATE:
         return `creó ${translateEntity} "${entityTitle}"`;
      case ACTION.UPDATE:
         return `actualizó ${translateEntity} "${entityTitle}"`;
      case ACTION.DELETE:
         return `eliminó ${translateEntity} "${entityTitle}"`;
      default:
         return `acción desconocida en ${translateEntity} "${entityTitle}"`;
   }
};

const translateEntityType = (entityType: ENTITY_TYPE) => {
   switch (entityType) {
      case ENTITY_TYPE.CARD:
         return 'la tarjeta';
      case ENTITY_TYPE.LIST:
         return 'la lista';
      case ENTITY_TYPE.BOARD:
         return 'el tablero';
      default:
         return 'el elemento';
   }
};
