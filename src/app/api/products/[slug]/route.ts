import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, published: true },
      include: {
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json()

    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: body,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('PUT /api/products/[slug] error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await prisma.product.delete({ where: { slug: params.slug } })
    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (error) {
    console.error('DELETE /api/products/[slug] error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
