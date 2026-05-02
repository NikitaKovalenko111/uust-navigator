import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export const MapCard = () => {
  const path = useSelector((state: RootState) => state.pathReducer.currentPath);
  const currentStep = useSelector((state: RootState) => state.pathReducer.currentStep);

  const totalSteps = path.length;
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  if (totalSteps === 0) {
    return (
      <section className="map-card" aria-label="Просмотр маршрута">
        <div className="map-card__viewport" role="img" aria-label="Карта без маршрута" />
        <div className="map-card__progress">
          <div className="map-card__progress-head">
            <p className="map-card__progress-label">Прогресс маршрута</p>
            <p className="map-card__progress-value">—</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="map-card" aria-label="Просмотр маршрута">
      <div className="map-card__viewport" role="img" aria-label={`Маршрут: шаг ${currentStep}`} />
      <div className="map-card__progress">
        <div className="map-card__progress-head">
          <p className="map-card__progress-label">Прогресс маршрута</p>
          <p className="map-card__progress-value">{currentStep}/{totalSteps} шагов</p>
        </div>
        <div
          className="map-card__progress-bar"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="map-card__progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></span>
        </div>
      </div>
    </section>
  );
};
