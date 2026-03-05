"use client";


import type { GalleryImage } from '@/types/teacher';
import { useTranslations } from 'next-intl';

interface TeacherGallerySectionProps {
  gallery: GalleryImage[];
}

export function TeacherGallerySection({ gallery }: TeacherGallerySectionProps) {
  const hasImages = gallery && gallery.length > 0;
  const t = useTranslations('page.teachers');

  return (
    <section className="overflow-x-hidden">

      <h2
        className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] mb-4 sm:mb-5 lg:mb-5"
        style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '32px' }}
      >
        {t('galleryTitle')}
      </h2>

      {!hasImages ? (
        <div className="text-center py-10 text-gray-500">
          {t('noGalleryImages')}
        </div>
      ) : (
        <>

          <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {gallery.slice(0, 12).map((image) => (
                <div
                  key={image.id}
                  className="relative flex-shrink-0 w-[272px] h-[204px] rounded-lg overflow-hidden bg-gray-200 snap-start group"
                  style={{
                    scrollSnapAlign: 'start',
                  }}
                  title={image.caption}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_MINIO}/${image.imageUrl}`}
                    alt={image.caption || 'Gallery photo'}
                    className="object-cover w-full h-full"
                    sizes="272px"
                  />
                  {image.caption && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                      <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
            {gallery.slice(0, 12).map((image) => (
              <div
                key={image.id}
                className="relative rounded-lg overflow-hidden bg-gray-200 hover:opacity-90 transition-opacity cursor-pointer group"
                style={{ aspectRatio: '119/89.25' }}
                title={image.caption}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_MINIO}/${image.imageUrl}`}
                  alt={image.caption || 'Gallery photo'}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

    </section>
  );
}
