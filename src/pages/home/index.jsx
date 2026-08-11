import { Helmet } from 'react-helmet-async';
import Hero from '../../components/home/Hero.jsx';
import AboutPreview from '../../components/home/AboutPreview.jsx';
import StudentJourney from '../../components/home/StudentJourney.jsx';
import WhyChoose from '../../components/home/WhyChoose.jsx';
import Initiatives from '../../components/home/Initiatives.jsx';
import Achievements from '../../components/home/Achievements.jsx';
import Values from '../../components/home/Values.jsx';
import NewsSection from '../../components/home/NewsSection.jsx';
import QuickLinks from '../../components/home/QuickLinks.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Manjara International School</title>
        <meta name="description" content="A premium, modern homepage experience for Manjara International School with engaging sections for admissions, academics, achievements, and community stories." />
      </Helmet>
      <Hero />
      <AboutPreview />
      <StudentJourney />
      <WhyChoose />
      <Initiatives />
      <Achievements />
      <Values />
      <NewsSection />
      <QuickLinks />
    </>
  );
};

export default HomePage;
