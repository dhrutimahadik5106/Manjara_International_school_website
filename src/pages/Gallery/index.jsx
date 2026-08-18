import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import { imageAssets } from '../../data/images.js';

const galleryItems = [
  { category: 'Campus', image: imageAssets.gallery[0] },
  { category: 'Classrooms', image: imageAssets.gallery[1] },
  { category: 'Students', image: imageAssets.gallery[2] },
  { category: 'Sports', image: imageAssets.gallery[3] },
  { category: 'Activities', image: imageAssets.gallery[4] },
  { category: 'Facilities', image: imageAssets.schoolCampus },
];

const GalleryPage = () => {
  return (
    <>
      <Helmet><title>Gallery | Manjara International School</title></Helmet>
      <PageHero title="Gallery" subtitle="A visual journey through the campus, learning spaces, student life, and community moments." backgroundImage={imageAssets.gallery[0]} breadcrumb={['Gallery']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item) => (
              <div key={item.category} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={item.image} alt={item.category} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
