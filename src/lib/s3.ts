import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

// ============================================================================
// INTERFACES
// ============================================================================

export interface S3ServiceConfig {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export interface UploadOptions {
  folder: 'products' | 'avatars' | 'digital-assets'
  file: Buffer
  filename: string
  contentType: string
}

export interface UploadResult {
  url: string
  key: string
  metadata: FileMetadata
}

export interface FileMetadata {
  filename: string
  size: number
  contentType: string
  duration?: number      // For audio/video (seconds)
  dimensions?: {         // For images
    width: number
    height: number
  }
  bitrate?: number       // For audio (kbps)
  resolution?: string    // For video (e.g., "1920x1080")
  format?: string        // File format
}

export interface SignedUrlOptions {
  key: string
  expiresIn?: number     // Seconds (default: 3600 = 1 hour)
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
  video: ['video/mp4', 'video/webm'],
  documents: ['application/pdf', 'application/zip', 'application/x-zip-compressed']
}

const SIZE_LIMITS = {
  images: 5 * 1024 * 1024,        // 5MB
  digitalAssets: 100 * 1024 * 1024 // 100MB
}

const FOLDER_STRUCTURE = {
  products: 'products/',
  avatars: 'avatars/',
  'digital-assets': 'digital-assets/'
}

// ============================================================================
// S3 SERVICE CLASS
// ============================================================================

export class S3Service {
  private client: S3Client
  private bucket: string

  constructor(config: S3ServiceConfig) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
    this.bucket = config.bucket
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    // Validate file type
    this.validateFileType(options.contentType, options.folder)

    // Validate file size
    this.validateFileSize(options.file.length, options.contentType)

    // Generate unique key
    const key = this.generateUniqueKey(options.folder, options.filename)

    // Extract metadata
    const metadata = await this.extractMetadata(options.file, options.contentType)

    try {
      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: options.file,
        ContentType: options.contentType,
      })

      await this.client.send(command)

      // Generate public URL
      const url = `https://${this.bucket}.s3.amazonaws.com/${key}`

      return {
        url,
        key,
        metadata: {
          ...metadata,
          filename: options.filename,
          size: options.file.length,
          contentType: options.contentType,
        },
      }
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate a signed URL for secure downloads
   */
  async generateSignedUrl(options: SignedUrlOptions): Promise<string> {
    const expiresIn = options.expiresIn || 3600 // Default: 1 hour

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: options.key,
      })

      const signedUrl = await getS3SignedUrl(this.client, command, { expiresIn })
      return signedUrl
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.client.send(command)
    } catch (error) {
      throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Extract metadata from file buffer
   */
  async extractMetadata(file: Buffer, contentType: string): Promise<Partial<FileMetadata>> {
    const metadata: Partial<FileMetadata> = {}

    try {
      // Extract format from content type
      metadata.format = contentType.split('/')[1]

      // Extract metadata based on file type
      if (contentType.startsWith('image/')) {
        metadata.dimensions = await this.extractImageMetadata(file)
      } else if (contentType.startsWith('audio/')) {
        const audioMeta = await this.extractAudioMetadata(file)
        metadata.duration = audioMeta.duration
        metadata.bitrate = audioMeta.bitrate
      } else if (contentType.startsWith('video/')) {
        const videoMeta = await this.extractVideoMetadata(file)
        metadata.duration = videoMeta.duration
        metadata.resolution = videoMeta.resolution
      }
    } catch (error) {
      console.warn('Failed to extract metadata:', error)
      // Don't throw error, just return partial metadata
    }

    return metadata
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Validate file type
   */
  private validateFileType(contentType: string, folder: string): void {
    const allAllowedTypes = [
      ...ALLOWED_TYPES.images,
      ...ALLOWED_TYPES.audio,
      ...ALLOWED_TYPES.video,
      ...ALLOWED_TYPES.documents,
    ]

    if (!allAllowedTypes.includes(contentType)) {
      throw new Error(
        `File type ${contentType} is not supported. Allowed types: ${allAllowedTypes.join(', ')}`
      )
    }
  }

  /**
   * Validate file size
   */
  private validateFileSize(size: number, contentType: string): void {
    const isImage = contentType.startsWith('image/')
    const maxSize = isImage ? SIZE_LIMITS.images : SIZE_LIMITS.digitalAssets

    if (size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      const actualSizeMB = (size / (1024 * 1024)).toFixed(2)
      throw new Error(
        `File size ${actualSizeMB}MB exceeds maximum of ${maxSizeMB}MB for ${isImage ? 'images' : 'digital assets'}`
      )
    }
  }

  /**
   * Generate unique key for S3 object
   */
  private generateUniqueKey(folder: string, filename: string): string {
    const prefix = FOLDER_STRUCTURE[folder as keyof typeof FOLDER_STRUCTURE]
    const timestamp = Date.now()
    const uuid = uuidv4()
    const extension = filename.split('.').pop()
    const sanitizedName = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.+/g, '.')
      .toLowerCase()

    return `${prefix}${timestamp}-${uuid}.${extension}`
  }

  /**
   * Extract image metadata using sharp
   */
  private async extractImageMetadata(file: Buffer): Promise<{ width: number; height: number }> {
    try {
      // Dynamic import to avoid loading sharp if not needed
      const sharp = (await import('sharp')).default
      const metadata = await sharp(file).metadata()
      
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      }
    } catch (error) {
      console.warn('Failed to extract image metadata:', error)
      return { width: 0, height: 0 }
    }
  }

  /**
   * Extract audio metadata using music-metadata
   */
  private async extractAudioMetadata(file: Buffer): Promise<{ duration?: number; bitrate?: number }> {
    try {
      // Dynamic import to avoid loading music-metadata if not needed
      const { parseBuffer } = await import('music-metadata')
      const metadata = await parseBuffer(file, { mimeType: 'audio/mpeg' })
      
      return {
        duration: metadata.format.duration ? Math.round(metadata.format.duration) : undefined,
        bitrate: metadata.format.bitrate ? Math.round(metadata.format.bitrate / 1000) : undefined,
      }
    } catch (error) {
      console.warn('Failed to extract audio metadata:', error)
      return {}
    }
  }

  /**
   * Extract video metadata
   * Note: This is a placeholder. For production, consider using ffprobe or similar
   */
  private async extractVideoMetadata(file: Buffer): Promise<{ duration?: number; resolution?: string }> {
    // TODO: Implement video metadata extraction
    // This would require ffprobe or similar tool
    // For now, return empty metadata
    console.warn('Video metadata extraction not yet implemented')
    return {}
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let s3ServiceInstance: S3Service | null = null

export function getS3Service(): S3Service {
  if (!s3ServiceInstance) {
    const config: S3ServiceConfig = {
      bucket: process.env.AWS_BUCKET_NAME || '',
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }

    // Validate configuration
    if (!config.bucket || !config.accessKeyId || !config.secretAccessKey) {
      throw new Error('AWS S3 configuration is incomplete. Check environment variables.')
    }

    s3ServiceInstance = new S3Service(config)
  }

  return s3ServiceInstance
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file type is image
 */
export function isImageType(contentType: string): boolean {
  return ALLOWED_TYPES.images.includes(contentType)
}

/**
 * Check if file type is audio
 */
export function isAudioType(contentType: string): boolean {
  return ALLOWED_TYPES.audio.includes(contentType)
}

/**
 * Check if file type is video
 */
export function isVideoType(contentType: string): boolean {
  return ALLOWED_TYPES.video.includes(contentType)
}
