import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { getAllPoints } from "../api/api";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import type { Point } from "../types/types";

const includesNormalized = (value: string, query: string) =>
  value.toLowerCase().includes(query);

export const PointsPage = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPoints = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getAllPoints();
        if (!mounted) return;
        setPoints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Ошибка загрузки точек:", err);
        if (!mounted) return;
        setError("Не удалось загрузить точки. Попробуйте позже.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPoints();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPoints = useMemo(() => {
    if (!normalizedQuery) return points;

    return points.filter((point) => {
      const inDescription = includesNormalized(point.description, normalizedQuery);
      const inNums = point.nums.some((num) => includesNormalized(num, normalizedQuery));
      const inTags = point.tags.some((tag) => includesNormalized(tag, normalizedQuery));

      return inDescription || inNums || inTags;
    });
  }, [points, normalizedQuery]);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="page">
      <Header />

      <main className="points-page" aria-label="Все точки навигации">
        <section className="points-panel">
          <div className="points-panel__head">
            <h1 className="points-panel__title">Все точки</h1>
            <p className="points-panel__meta">
              {loading ? "Загрузка..." : `Найдено: ${filteredPoints.length}`}
            </p>
          </div>

          <label className="points-panel__search" htmlFor="points-search">
            <span className="points-panel__search-label">Поиск по точкам</span>
            <input
              id="points-search"
              className="points-panel__search-input"
              type="text"
              placeholder="Например: вход, 2 корпус, библиотека"
              value={query}
              onChange={handleQueryChange}
            />
          </label>

          {error && <p className="points-panel__error">{error}</p>}

          {!loading && !error && (
            <ul className="points-list" aria-label="Список точек">
              {filteredPoints.length === 0 && (
                <li className="points-list__empty">Ничего не найдено по вашему запросу.</li>
              )}

              {filteredPoints.map((point) => (
                <li key={point.id} className="points-list__item">
                  <h2 className="points-list__title">{point.description}</h2>
                  <p className="points-list__id">ID: {point.id}</p>

                  <div className="points-list__row">
                    <span className="points-list__label">Кабинеты:</span>
                    <span className="points-list__value">{point.nums.length ? point.nums.join(", ") : "-"}</span>
                  </div>

                  <div className="points-list__row">
                    <span className="points-list__label">Теги:</span>
                    <span className="points-list__value">{point.tags.length ? point.tags.join(", ") : "-"}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};