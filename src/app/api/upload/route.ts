import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getS3Service } from '@/lib/s3'
import { prisma } from '@/lib/prisma'

// ============================================================================
// INTERFACES
// ============================================================================

interface UploadResponse {
  success: boolean
  url?: string
  key?: string
  metadata?: {
    filename: string
    size: number
    contentType: string
    duration?: number
    dimensions?: { width: number; height: number }
    bitrate?: number
    resolution?: string
    format?: string
  }
  error?: string
}

// ============================================================================
// POST /api/upload
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // 1. Validate authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to upload files.' },
        { status: 401 }
      )
    }

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    // 3. Validate file presence
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Please select a file to upload.' },
        { status: 400 }
      )
    }

    // 4. Validate folder parameter
    if (!folder || !['products', 'avatars', 'digital-assets'].includes(folder)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid folder parameter. Must be one of: products, avatars, digital-assets' 
        },
        { status: 400 }
      )
    }

    // 5. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 6. Get S3 service instance
    const s3Service = getS3Service()

    // 7. Upload file to S3
    let uploadResult
    try {
      uploadResult = await s3Service.uploadFile({
        folder: folder as 'products' | 'avatars' | 'digital-assets',
        file: buffer,
        filename: file.name,
        contentType: file.type,
      })
    } catch (error) {
      // Handle S3 upload errors
      if (error instanceof Error) {
        if (error.message.includes('not supported')) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
          )
        }
        if (error.message.includes('exceeds maximum')) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 413 }
          )
        }
      }
      
      throw error // Re-throw for generic error handler
    }

    // 8. Save file metadata to database
    try {
      // @ts-ignore - Prisma client regenerated, editor cache issue
      await prisma.fileMetadata.create({
        data: {
          key: uploadResult.key,
          url: uploadResult.url,
          filename: uploadResult.metadata.filename,
          size: uploadResult.metadata.size,
          contentType: uploadResult.metadata.contentType,
          folder: folder,
          duration: uploadResult.metadata.duration,
          width: uploadResult.metadata.dimensions?.width,
          height: uploadResult.metadata.dimensions?.height,
          bitrate: uploadResult.metadata.bitrate,
          resolution: uploadResult.metadata.resolution,
          format: uploadResult.metadata.format,
          userId: (session.user as any).id,
        },
      })
    } catch (dbError) {
      console.error('Failed to save file metadata to database:', dbError)
      // Don't fail the upload if DB save fails, just log it
    }

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        url: uploadResult.url,
        key: uploadResult.key,
        metadata: uploadResult.metadata,
      },
      { status: 200 }
    )

  } catch (error) {
    // Generic error handler
    console.error('Upload API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET /api/upload (Optional - for testing)
// ============================================================================

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      message: 'Upload API is running',
      endpoints: {
        POST: '/api/upload',
        description: 'Upload a file to S3',
        parameters: {
          file: 'File (required)',
          folder: 'String (required): products | avatars | digital-assets',
        },
        authentication: 'Required',
      },
    },
    { status: 200 }
  )
}
