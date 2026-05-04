import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

// ============================================================================
// INTERFACES
// ============================================================================

interface OrdersResponse {
  success: boolean
  orders?: any[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}

// ============================================================================
// GET /api/orders
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse<OrdersResponse>> {
  try {
    // 1. Validate authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to view orders.' },
        { status: 401 }
      )
    }

    const currentUser = session.user as any
    const userId = currentUser.id
    const userRole = currentUser.role

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    
    const status = searchParams.get('status') as OrderStatus | null
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const requestedUserId = searchParams.get('userId')

    // 3. Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.' 
        },
        { status: 400 }
      )
    }

    // 4. Build where clause
    const where: any = {}

    // 4.1 User filtering (with admin access control)
    if (userRole === 'ADMIN' && requestedUserId) {
      // Admin can filter by any userId
      where.userId = requestedUserId
    } else {
      // Non-admin users can only see their own orders
      where.userId = userId
    }

    // 4.2 Status filtering
    if (status && ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(status)) {
      where.status = status
    }

    // 4.3 Date range filtering
    if (from || to) {
      where.createdAt = {}
      
      if (from) {
        const fromDate = new Date(from)
        if (!isNaN(fromDate.getTime())) {
          where.createdAt.gte = fromDate
        }
      }
      
      if (to) {
        const toDate = new Date(to)
        if (!isNaN(toDate.getTime())) {
          // Set to end of day
          toDate.setHours(23, 59, 59, 999)
          where.createdAt.lte = toDate
        }
      }
    }

    // 5. Calculate pagination
    const skip = (page - 1) * limit
    const take = limit

    // 6. Query orders with items and products
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ])

    // 7. Format response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      user: order.user,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      status: order.status,
      paymentIntent: order.paymentIntent,
      couponCode: order.couponCode,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          imageUrl: item.product.images[0] || null,
        },
      })),
    }))

    // 8. Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        orders: formattedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    )

  } catch (error) {
    // Generic error handler
    console.error('Orders API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}
