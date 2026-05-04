import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getS3Service } from '@/lib/s3'
import { prisma } from '@/lib/prisma'

// ============================================================================
// INTERFACES
// ============================================================================

interface DownloadResponse {
  success: boolean
  downloadUrl?: string
  expiresAt?: string
  error?: string
}

interface RouteParams {
  params: {
    orderId: string
    productId: string
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RATE_LIMIT_MAX_DOWNLOADS = 5
const RATE_LIMIT_WINDOW_HOURS = 24
const SIGNED_URL_EXPIRATION_SECONDS = 3600 // 1 hour

// ============================================================================
// GET /api/orders/[orderId]/download/[productId]
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<DownloadResponse>> {
  try {
    const { orderId, productId } = params

    // 1. Validate authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to download files.' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // 2. Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      )
    }

    // 3. Verify order belongs to the authenticated user
    if (order.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this order.' },
        { status: 403 }
      )
    }

    // 4. Verify order is paid
    if (order.status !== 'PAID') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Order is not paid. Current status: ${order.status}` 
        },
        { status: 403 }
      )
    }

    // 5. Verify product is in the order
    const orderItem = order.items.find(item => item.productId === productId)
    
    if (!orderItem) {
      return NextResponse.json(
        { success: false, error: 'Product not found in this order.' },
        { status: 404 }
      )
    }

    // 6. Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      )
    }

    // 7. Get file metadata for digital asset
    // @ts-ignore - Prisma client regenerated, editor cache issue
    const fileMetadataList = await prisma.fileMetadata.findMany({
      where: {
        productId,
        folder: 'digital-assets',
      },
      take: 1,
    })

    // 8. Verify product has a digital asset
    if (!fileMetadataList || fileMetadataList.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This product does not have a downloadable file.' 
        },
        { status: 404 }
      )
    }

    const fileMetadata = fileMetadataList[0]

    // 9. Check rate limit (5 downloads per 24 hours)
    const rateLimitStart = new Date()
    rateLimitStart.setHours(rateLimitStart.getHours() - RATE_LIMIT_WINDOW_HOURS)

    // @ts-ignore - Prisma client regenerated, editor cache issue
    const recentDownloads = await prisma.downloadLog.count({
      where: {
        userId,
        productId,
        downloadedAt: {
          gte: rateLimitStart,
        },
      },
    })

    if (recentDownloads >= RATE_LIMIT_MAX_DOWNLOADS) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Download limit exceeded. You can download this file ${RATE_LIMIT_MAX_DOWNLOADS} times per ${RATE_LIMIT_WINDOW_HOURS} hours. Please try again later.` 
        },
        { status: 429 }
      )
    }

    // 10. Generate signed URL
    const s3Service = getS3Service()
    let signedUrl: string

    try {
      signedUrl = await s3Service.generateSignedUrl({
        key: fileMetadata.key,
        expiresIn: SIGNED_URL_EXPIRATION_SECONDS,
      })
    } catch (error) {
      console.error('Failed to generate signed URL:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate download link. Please try again later.' 
        },
        { status: 500 }
      )
    }

    // 11. Create download log
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    try {
      // @ts-ignore - Prisma client regenerated, editor cache issue
      await prisma.downloadLog.create({
        data: {
          userId,
          orderId,
          productId,
          ipAddress,
          userAgent,
        },
      })
    } catch (dbError) {
      console.error('Failed to create download log:', dbError)
      // Don't fail the download if logging fails, just log the error
    }

    // 12. Calculate expiration time
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + SIGNED_URL_EXPIRATION_SECONDS)

    // 13. Return success response
    return NextResponse.json(
      {
        success: true,
        downloadUrl: signedUrl,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 200 }
    )

  } catch (error) {
    // Generic error handler
    console.error('Download API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}
