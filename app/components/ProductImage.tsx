import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductImageProps = {
  selectedVariantImage: ProductVariantFragment['image'];
  images: GalleryImage[];
};

export default function ProductImage({selectedVariantImage, images}: ProductImageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const allImages = selectedVariantImage
    ? [selectedVariantImage, ...images.filter((img) => img.id !== selectedVariantImage.id)]
    : images;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    setDragOffset(currentTouch - touchStart);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const minSwipeDistance = 50;
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
        if (modalOpen) setModalIndex((prev) => prev - 1);
      } else if (dragOffset < 0 && selectedIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
        if (modalOpen) setModalIndex((prev) => prev + 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const getImagePosition = (index: number) => {
    const baseTransform = isDragging ? dragOffset : 0;
    const diff = index - (modalOpen ? modalIndex : selectedIndex);
    return `translate3d(calc(${diff * 100}% + ${baseTransform}px), 0, 0)`;
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  if (allImages.length < 1) {
    return <div className="aspect-square bg-amber-100 rounded-lg animate-pulse"></div>;
  }

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        <div
          className="aspect-square relative rounded-lg overflow-hidden bg-brand-cream cursor-zoom-in"
          onClick={() => !isDragging && openModal(selectedIndex)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0">
            {allImages.map((image, index) => (
              <div
                key={`image-${image.id || index}`}
                className={`absolute inset-0 w-full h-full ${
                  !isDragging
                    ? 'transition-transform duration-300 ease-out'
                    : 'transition-none'
                }`}
                style={{transform: getImagePosition(index)}}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  data={image}
                  sizes="(min-width:1020px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* navigation arrow  */}
          <div className='absolute inset-0 hidden md:flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity'>
            <button 
            onClick={(e)=>{
              e.stopPropagation();
              if(selectedIndex > 0){
                setSelectedIndex((prev)=> prev - 1 );

              }
            }}
            className='bg-white/90 rounded-full p-2 hover:bg-white transition-colors cursor-pointer'
          disabled={selectedIndex === 0}
            >
              <ChevronLeft className='w-6 h-6 text-black'/>
            </button>
            <button 
            onClick={(e)=>{
              e.stopPropagation();
              if(selectedIndex < allImages.length -1){
                setSelectedIndex((prev)=> prev + 1 );

              }
            }}
            className='bg-white/90 rounded-full p-2 hover:bg-white transition-colors cursor-pointer'
          disabled={selectedIndex === allImages.length - 1}
            >
              <ChevronRight className='w-6 h-6 text-black'/>
            </button>
          </div>
          
        </div>
{/* Thumnail Strip  */}
          <div className='hidden md:grid grid-cols-[repeat(auto-fill,_5rem)] gap-4 py-2 ps-1'>
            {allImages.map((image, index)=>(
              <button 
              onClick={()=> setSelectedIndex(index)}
              key={`thumnail-${index}-${image.id || 'x'}`}
              className={`relative aspect-square w-20 rounded-md overflow-hidded transition-all duration-all duration-300 ease-out ${
                selectedIndex === index
                ?'ring-2 ring-red-600 ring-offset-2'
                :'hover:ring-2 hover:ring-red-600/10 hover:ring-offset-2 opacity-70 hover:opacity-100'
              }`}
              >
                <Image
                alt={image.altText || 'Product Thumnail'}
                data={image}
                sizes='80px'
                className='w-full h-full object-cover cursor-pointer'
                />

              </button>
            ))}
          </div>
      </div>

      {/* Modal Viewer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
            onClick={closeModal}
          >
            &times;
          </div>
          <div
            className="w-full max-w-4xl aspect-square relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0">
              {allImages.map((image, index) => (
                <div
                  key={`modal-image-${image.id || index}`}
                  className={`absolute inset-0 w-full h-full ${
                    !isDragging
                      ? 'transition-transform duration-300 ease-out'
                      : 'transition-none'
                  }`}
                  style={{transform: getImagePosition(index)}}
                >
                  <Image
                    alt={image.altText || 'Product Image'}
                    data={image}
                    sizes="100vw"
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
