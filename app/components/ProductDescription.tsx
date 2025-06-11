import { useState } from 'react';

// Props type
type ProductDescriptionProps = {
  descriptionHtml: string;
  ingredientsHtml: string;
  customHtml: string;
};

export default function ProductDescription({
  descriptionHtml,
  ingredientsHtml,
  customHtml,
}: ProductDescriptionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);  // default open

  const toggle = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);  // collapse if already open
    } else {
      setOpenSection(section);  // open clicked section
    }
  };

  const sections = [
    { key: 'description', title: 'Product Description', content: descriptionHtml },
    { key: 'ingredients', title: 'Ingredients', content: ingredientsHtml },
    { key: 'custom', title: 'Additional Info', content: customHtml },
  ];

  return (
    <div className="text-black font-filson border pl-3 pr-3 bg-rose-500/5  border-rose-500/10 rounded">
      {sections.map(({ key, title, content }) => (
        <div key={key} className="border-rose-500/20 border-b">
          <button
            className="w-full flex justify-between items-center p-3 text-left text-md font-amiri font-medium transition"
            onClick={() => toggle(key)}
          >
            <span>{title}</span>
            <span
              className={`transition-transform duration-300 ${openSection === key ? 'rotate-180' : ''}`}
            >
              <img src="/app/assets/Icons/Vector_12.png" alt="icon" />
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 pl-4 pr-4 ease-in-out ${
              openSection === key ? 'max-h-[1000px] p-4' : 'max-h-0'
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
