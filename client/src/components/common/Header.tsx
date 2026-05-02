export const Header = () => {
  return (
    <header className="header">
      <div className="header__brand">
        <img src="./favicon.png" alt="logo" className="header__logo" />
        <div className="header__text">
          <p className="header__subtitle">УУНиТ</p>
          <p className="header__title">Навигатор</p>
        </div>
      </div>
      <button className="header__action" type="button" aria-label="История маршрутов">
        Маршруты
      </button>
    </header>
  );
};
