// app/components/ServiceHighlights.tsx

const features = [
  {
    title: 'Worldwide Delivery',
    icon: '/app/assets/icons/worldwide-delivery.png',
  },
  {
    title: 'Free Shipping',
    icon: '/app/assets/icons/free-shipping.png',
  },
  {
    title: 'Cash On Delivery',
    icon: '/app/assets/icons/cod.png',
  },
  {
    title: 'Easy Customer Support',
    icon: '/app/assets/icons/support.png',
  },
  {
    title: 'Easy Payments',
    icon: '/app/assets/icons/payment.png',
  },
];

export default function ServiceHighlights() {
  return (
    <section className="w-full bg-pink-50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center w-[120px]">
            <div className="w-20 h-20 border border-red-400 rounded-full flex items-center justify-center mb-2 p-3">
              <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
            </div>
            <p className="text-sm font-medium text-gray-800">{feature.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
