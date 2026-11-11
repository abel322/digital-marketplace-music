// src/app/products/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; query?: string; sort?: string }> | { type?: string; query?: string; sort?: string };
}) {
  const resolvedParams = await searchParams;
  const { type, query, sort } = resolvedParams || {};

  const whereClause: any = {
    status: 'PUBLISHED', // Solo mostrar contenido que el admin haya publicado
  };

  if (type) {
    const typeUpper = type.toUpperCase();
    if (typeUpper === 'COURSE') whereClause.type = 'COURSE';
    else if (typeUpper === 'SAMPLES') whereClause.type = { in: ['SAMPLE_PACK', 'LOOP'] };
    else if (typeUpper === 'MUSIC') whereClause.type = { in: ['TRACK', 'BEAT_TRACK'] };
    else if (typeUpper === 'BUNDLES') whereClause.type = 'BUNDLE';
  }

  if (query) {
    whereClause.title = { contains: query, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: sort === 'price-asc' ? { price: 'asc' } : { createdAt: 'desc' },
    include: {
      modules: {
        select: { id: true, lessons: { select: { id: true } } },
      },
    },
  });

  const categories = [
    { label: 'Todos', href: '/products', active: !type },
    { label: 'Cursos Online', href: '/products?type=COURSE', active: type?.toUpperCase() === 'COURSE' },
    { label: 'Samples & Loops', href: '/products?type=SAMPLES', active: type?.toUpperCase() === 'SAMPLES' },
    { label: 'Música & Beats', href: '/products?type=MUSIC', active: type?.toUpperCase() === 'MUSIC' },
    { label: 'Bundles', href: '/products?type=BUNDLES', active: type?.toUpperCase() === 'BUNDLES' },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Catálogo Digital</h1>
            <p className="text-sm text-slate-400 mt-1">
              {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          </div>

          {/* Filtros de Pestaña */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  cat.active
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Cuadrícula de Productos */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No hay productos publicados bajo esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item: any) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  coverUrl: item.coverUrl || item.thumbnailUrl,
                  productType: item.productType || item.type,
                  musicalKey: item.musicalKey || item.key,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
