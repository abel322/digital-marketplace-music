import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ message: 'OK' }, { status: 200 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000)

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    })

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
