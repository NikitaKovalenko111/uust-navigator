import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SavedRoute } from "../utils/routesStorage";
import { loadRoutes, removeRoute, clearRoutes } from "../utils/routesStorage";
import { useAppDispatch } from "../hooks";
import { setPath } from "../redux/features/pathSlice";
import cn from "classnames";
import "../styles/scss/modules/_routes-modal.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const RoutesModal: React.FC<Props> = ({ open, onClose }) => {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) setRoutes(loadRoutes());
  }, [open]);

  if (!open) return null;

  const handleRestore = (r: SavedRoute) => {
    dispatch(setPath(r.path));
    onClose();
  };

  const handleDelete = (id: string) => {
    removeRoute(id);
    setRoutes(loadRoutes());
  };

  const handleClear = () => {
    clearRoutes();
    setRoutes([]);
  };

  return createPortal(
    <div className="routes-modal__overlay" role="dialog" aria-modal="true">
      <div className="routes-modal">
        <header className="routes-modal__header">
          <h3 className="routes-modal__title">Предыдущие маршруты</h3>
          <button className="routes-modal__close" onClick={onClose} aria-label="Закрыть">×</button>
        </header>

        <div className="routes-modal__body">
          {routes.length === 0 ? (
            <div className="routes-modal__empty">Здесь пока нет сохранённых маршрутов.</div>
          ) : (
            <ul className="routes-modal__list">
              {routes.map(r => (
                <li key={r.id} className="routes-modal__item">
                  <div className="routes-modal__meta">
                    <div className="routes-modal__route">
                      <strong>{r.fromDesc}</strong>
                      <span className="routes-modal__arrow">→</span>
                      <strong>{r.toDesc}</strong>
                    </div>
                    <div className="routes-modal__info">{r.depth} шагов · {new Date(r.ts).toLocaleString()}</div>
                  </div>

                  <div className="routes-modal__actions">
                    <button className="routes-modal__btn routes-modal__btn--primary" onClick={() => handleRestore(r)}>Восстановить</button>
                    <button className="routes-modal__btn routes-modal__btn--ghost" onClick={() => handleDelete(r.id)}>Удалить</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="routes-modal__footer">
          <button className="routes-modal__btn routes-modal__btn--ghost" onClick={onClose}>Закрыть</button>
          <button className={cn("routes-modal__btn", {"routes-modal__btn--danger": routes.length > 0})} onClick={handleClear}>Очистить все</button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default RoutesModal;
