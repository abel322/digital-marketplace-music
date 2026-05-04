import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = { published: true }

    if (category) where.category = { slug: category }
    if (type) where.type = type
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }

    const orderBy: any = {}
    if (sort === 'price') orderBy.price = order
    else if (sort === 'rating') orderBy.rating = order
    else if (sort === 'sales') orderBy.totalSales = order
    else orderBy.createdAt = order

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      price,
      originalPrice,
      type,
      categoryId,
      images,
      fileUrl,
      previewUrl,
      youtubeId,
      features,
      tags,
    } = body

    if (!title || !price || !type) {
      return NextResponse.json({ message: 'Campos requeridos: title, price, type' }, { status: 400 })
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        originalPrice: originalPrice ?? null,
        type,
        categoryId,
        images: images || [],
        fileUrl,
        previewUrl,
        youtubeId,
        features: features || [],
        tags: tags || [],
        published: false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
