import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoutesModal from "../RoutesModal";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isPointsPage = location.pathname === "/points";

  return (
    <>
      <header className="header">
        <div className="header__brand">
          <img src="./favicon.png" alt="logo" className="header__logo" />
          <div className="header__text">
            <p className="header__subtitle">УУНиТ</p>
            <p className="header__title">Навигатор</p>
          </div>
        </div>

        <div className="header__actions">
          <button
            className="header__action"
            type="button"
            aria-label={isPointsPage ? "Перейти к навигатору" : "Перейти к точкам"}
            onClick={() => navigate(isPointsPage ? "/" : "/points")}
          >
            {isPointsPage ? "Навигатор" : "Точки"}
          </button>

          <button className="header__action" type="button" aria-label="История маршрутов" onClick={() => setOpen(true)}>
            Маршруты
          </button>
        </div>
      </header>

      <RoutesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
