'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export function ProductCard({ product }: { product: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current || !product.previewAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const isCourse = (product.productType || product.type) === 'COURSE';
  const totalLessons = product.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
  const coverUrl = product.coverUrl || product.thumbnailUrl;
  const displayType = (product.productType || product.type || '').replace('_', ' ');

  return (
    <div className="group bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/20">
      <div>
        {/* Contenedor Visual de Portada */}
        <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden mb-4 border border-slate-800">
          {coverUrl ? (
            <img src={coverUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0d1322]">
              <span className="text-3xl opacity-40">{isCourse ? '🎓' : '🎵'}</span>
            </div>
          )}

          {/* Insignia de Tipo */}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
            {displayType}
          </span>

          {/* Botón de Preescucha si tiene audio */}
          {product.previewAudioUrl && (
            <button
              onClick={togglePlay}
              className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform active:scale-90"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          )}
          {product.previewAudioUrl && (
            <audio ref={audioRef} src={product.previewAudioUrl} onEnded={() => setIsPlaying(false)} preload="none" />
          )}
        </div>

        {/* Metadatos */}
        <h3 className="text-base font-bold text-white line-clamp-1 mb-1 group-hover:text-cyan-400 transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
          {isCourse
            ? `${product.modules?.length || 0} Módulos • ${totalLessons} Lecciones grabadas`
            : product.bpm
            ? `${product.bpm} BPM • Tonalidad: ${product.musicalKey || product.key || 'Universal'}`
            : 'Librería de alta fidelidad 24-bit WAV'}
        </p>
      </div>

      {/* Pie con Precio y Acción */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Precio</span>
          <span className="text-lg font-black text-white font-mono">${(typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0).toFixed(2)}</span>
        </div>

        <Link
          href={`/products/${product.slug || product.id}`}
          className="px-4 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold text-xs rounded-xl transition-all"
        >
          {isCourse ? 'Ver Curso' : 'Obtener'}
        </Link>
      </div>
    </div>
  );
}
