import './Header.css';
import Logo3D from './Logo3D';
import DesktopLogo from './media/logos/desktop.png';
import MobileLogo from './media/logos/mobile.png';
import { useState, useEffect } from 'react';

/**
 * Esta funçao é responsavel pela implementação 
 * @returns 
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Lemos o utilizador do localStorage quando o Header carrega
  useEffect(() => {
      try {
          const userString = localStorage.getItem('user');
          if (userString) {
              setUser(JSON.parse(userString));
          }
      } catch (error) {
          console.warn("Erro ao ler dados do utilizador.");
      }
  }, []);

  //Gere se o menu mobile deve abrir/fechar
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //gere o logout to utilizador
  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
  };

  return (
    <header>
      <div className="header-container">
        
        <div className="logotipo-mobile logo-3d">
          <a href="/">
            <Logo3D imageSrc={MobileLogo} width={50} height={55} />
          </a>
        </div>
        <div className="logotipo-desktop logo-3d">
          <a href="/">
            <Logo3D imageSrc={DesktopLogo} width={220} height={85} />
          </a>
        </div>

        <button className="menu-toggle" onClick={handleMenuToggle}>
          ☰
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'open' : 'closed'}`}>
          <li><a href="/#Missao">Missão</a></li>
          <li><a href="/#Investigacao">Investigação</a></li>
          <li><a href="/#Parcerias">Parcerias</a></li>
          <li><a href="/#Conquistas">Conquistas</a></li>
          <li><a href="/#Eventos">Eventos</a></li>
          <li><a href="/#Newsletter">Newsletter</a></li>
          <li><a href="/#Contactos">Contactos</a></li>

          {!user ? (

              <li className="auth-buttons">
                  <a href="/login" className="btn-header-login">Iniciar Sessão</a>
                  <a href="/register" className="btn-header-register">Registar</a>
              </li>
          ) : (

              <li className="auth-user">
                  <a href="/perfil" className="user-greeting" title="Ir para o meu perfil" style={{ textDecoration: 'none' }}>
                      Olá, <b>{user.nome}</b> 
                      {user.role === 'admin' && <span className="badge-admin"> (Admin)</span>}
                  </a>
                  <button onClick={handleLogout} className="btn-header-logout">Sair</button>
              </li>
          )}
        </ul>
      </div>
    </header>
  );
}