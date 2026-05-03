import { useEffect, useState, type ChangeEvent } from "react";
import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useAppDispatch } from "../hooks";
import { fetchAllPoints, fetchPoints } from "../redux/features/pointSlice";

export const PointsPage = () => {
  const points = useSelector((state: RootState) => state.pointReducer.foundPoints)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()

  useEffect(() => {
    let mounted = true

    const loadPoints = async () => {
      if (query == "") {
        dispatch(fetchAllPoints({
          setLoading: setLoading,
          setError: setError,
          mounted: mounted
        }))
      } else {
        try {
          setLoading(true)
          await dispatch(fetchPoints(query))
        } catch (err) {
          setError("Не удалось получить точки")
        } finally {
          setLoading(false)
        }
      }
    }

    loadPoints()

    return () => {
      mounted = false
    }
  }, [query])

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
              {loading ? "Загрузка..." : `Найдено: ${points.length}`}
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
              {points.length === 0 && (
                <li className="points-list__empty">Ничего не найдено по вашему запросу.</li>
              )}

              {points.map((point) => (
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