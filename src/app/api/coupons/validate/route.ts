import { NextRequest, NextResponse } from 'next/server'

// Mock coupons — in production these come from the DB
const MOCK_COUPONS: Record<string, { id: string; code: string; discount: number; type: 'PERCENTAGE' | 'FIXED'; active: boolean; usedCount: number }> = {
    BIENVENIDO10: { id: '1', code: 'BIENVENIDO10', discount: 10, type: 'PERCENTAGE', active: true, usedCount: 0 },
    MUSICA20: { id: '2', code: 'MUSICA20', discount: 20, type: 'PERCENTAGE', active: true, usedCount: 0 },
    OFF15: { id: '3', code: 'OFF15', discount: 15, type: 'FIXED', active: true, usedCount: 0 },
    VERANO30: { id: '4', code: 'VERANO30', discount: 30, type: 'PERCENTAGE', active: true, usedCount: 0 },
}

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json()

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Código requerido' }, { status: 400 })
        }

        const coupon = MOCK_COUPONS[code.trim().toUpperCase()]

        if (!coupon) {
            return NextResponse.json({ error: 'El cupón no existe o ha expirado' }, { status: 404 })
        }

        if (!coupon.active) {
            return NextResponse.json({ error: 'Este cupón ya no está activo' }, { status: 400 })
        }

        return NextResponse.json(coupon)
    } catch (error) {
        console.error('POST /api/coupons/validate error:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
