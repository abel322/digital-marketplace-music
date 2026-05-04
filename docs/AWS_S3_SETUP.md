# Configuración de AWS S3 para Digital Marketplace

## Requisitos Previos

- Cuenta de AWS activa
- Acceso a AWS Console

## Pasos de Configuración

### 1. Crear Bucket S3

1. Accede a [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Haz clic en "Create bucket"
3. Configuración del bucket:
   - **Bucket name**: `digital-marketplace-files-[tu-nombre-unico]`
   - **AWS Region**: `us-east-1` (o tu región preferida)
   - **Block Public Access**: Mantener todas las opciones marcadas (el bucket NO debe ser público)
   - **Bucket Versioning**: Opcional (recomendado para producción)
   - **Default encryption**: Habilitar con SSE-S3
4. Haz clic en "Create bucket"

### 2. Configurar CORS

1. Selecciona tu bucket
2. Ve a la pestaña "Permissions"
3. Scroll hasta "Cross-origin resource sharing (CORS)"
4. Haz clic en "Edit" y pega la siguiente configuración:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://tu-dominio.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Guarda los cambios

### 3. Crear Usuario IAM

1. Accede a [IAM Console](https://console.aws.amazon.com/iam/)
2. Ve a "Users" → "Add users"
3. Configuración:
   - **User name**: `digital-marketplace-s3-user`
   - **Access type**: Selecciona "Access key - Programmatic access"
4. Haz clic en "Next: Permissions"

### 4. Configurar Permisos

1. Selecciona "Attach existing policies directly"
2. Busca y selecciona: `AmazonS3FullAccess` (para desarrollo)
   
   **Para producción**, crea una política personalizada más restrictiva:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::digital-marketplace-files-[tu-nombre-unico]",
        "arn:aws:s3:::digital-marketplace-files-[tu-nombre-unico]/*"
      ]
    }
  ]
}
```

3. Haz clic en "Next: Tags" (opcional)
4. Haz clic en "Next: Review"
5. Haz clic en "Create user"

### 5. Guardar Credenciales

1. **IMPORTANTE**: Copia las credenciales mostradas:
   - **Access key ID**: `AKIA...`
   - **Secret access key**: `wJalr...` (solo se muestra una vez)
2. Descarga el archivo CSV como respaldo

### 6. Configurar Variables de Entorno

Actualiza tu archivo `.env.local`:

```env
# ==============================================
# AWS S3
# ==============================================
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="wJalr..."
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="digital-marketplace-files-[tu-nombre-unico]"
```

### 7. Verificar Configuración

Ejecuta el siguiente comando para verificar que las credenciales funcionan:

```bash
npm run test:s3
```

O prueba manualmente subiendo un archivo de prueba desde la aplicación.

## Estructura de Carpetas en S3

El sistema organizará los archivos automáticamente en la siguiente estructura:

```
digital-marketplace-files-[tu-nombre-unico]/
├── products/           # Imágenes de productos
├── avatars/            # Avatares de usuarios
└── digital-assets/     # Archivos digitales descargables
```

## Seguridad

### Mejores Prácticas

1. **Nunca** compartas tus credenciales de AWS
2. **Nunca** subas el archivo `.env.local` a Git
3. Usa IAM roles en producción en lugar de access keys
4. Habilita MFA en tu cuenta de AWS
5. Revisa regularmente los logs de acceso a S3
6. Configura alertas de CloudWatch para actividad inusual

### Rotación de Credenciales

Se recomienda rotar las credenciales cada 90 días:

1. Crea un nuevo access key en IAM
2. Actualiza `.env.local` con las nuevas credenciales
3. Verifica que la aplicación funciona
4. Elimina el access key antiguo

## Costos Estimados

### Almacenamiento
- **S3 Standard**: ~$0.023 por GB/mes
- **Primeros 50 TB**: $0.023 por GB

### Transferencia
- **Primeros 100 GB/mes**: Gratis
- **Siguientes 10 TB**: $0.09 por GB

### Requests
- **PUT, COPY, POST, LIST**: $0.005 por 1,000 requests
- **GET, SELECT**: $0.0004 por 1,000 requests

**Ejemplo**: Para 1,000 productos con 3 imágenes cada uno (3GB total) y 10,000 descargas/mes:
- Almacenamiento: ~$0.07/mes
- Transferencia: ~$0.90/mes (si cada descarga es 1MB)
- Requests: ~$0.05/mes
- **Total**: ~$1/mes

## Troubleshooting

### Error: "Access Denied"
- Verifica que las credenciales sean correctas
- Verifica que el usuario IAM tenga permisos en el bucket
- Verifica que el bucket name sea correcto

### Error: "CORS policy"
- Verifica que la configuración CORS incluya tu dominio
- Verifica que los métodos permitidos incluyan PUT y POST

### Error: "Bucket not found"
- Verifica que el bucket name sea correcto
- Verifica que la región sea correcta

## Recursos Adicionales

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Pricing Calculator](https://calculator.aws/)

## Soporte

Si encuentras problemas con la configuración de AWS S3, consulta:
1. La documentación oficial de AWS
2. Los logs de la aplicación en `digital-marketplace/logs/`
3. El equipo de desarrollo

---

**Última actualización**: Marzo 2026
