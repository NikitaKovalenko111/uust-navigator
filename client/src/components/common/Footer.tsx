import ghIcon from './../../assets/github.png'

export const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__text">УУНиТ Навигатор</p>
      <a className='footer__link' href="https://github.com/NikitaKovalenko111/uust-navigator"><img src={ghIcon} alt="github" /></a>
    </footer>
  );
};
