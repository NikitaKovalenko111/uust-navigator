import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RouteSearch } from '../components/RouteSearch';
import { MapCard } from '../components/MapCard';
import { StepCard } from '../components/StepCard';

export const Navigator = () => {
  return (
    <div className="page">
      <Header />
      <main className="navigator" aria-label="Построение маршрута">
        <RouteSearch />
        <MapCard />
        <StepCard />
      </main>
      <Footer />
    </div>
  );
};
