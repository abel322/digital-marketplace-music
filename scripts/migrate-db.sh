#!/bin/bash

# Script para ejecutar migraciones de Prisma
# Uso: ./scripts/migrate-db.sh

echo "🔄 Generando cliente de Prisma..."
npx prisma generate

echo ""
echo "🔄 Ejecutando migración de base de datos..."
npx prisma migrate dev --name add_file_metadata_and_download_log

echo ""
echo "✅ Migración completada!"
echo ""
echo "Para ver la base de datos en Prisma Studio, ejecuta:"
echo "npm run db:studio"
