import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useMemo, useState } from 'react';
// useMemo => O `useMemo` é usado aqui para calcular o valor de `isLoggedIn` uma única vez na montagem do componente, evitando recalcular a presença do cookie `'auth_hash'` em renderizações subsequentes, o que melhora a eficiência de renderização. Como o valor de `isLoggedIn` não depende de mudanças dentro do componente e não precisa ser reativo, o uso de `useMemo` evita cálculos desnecessários, ao contrário do `useState`, que exigiria uma re-renderização a cada alteração de estado, mesmo que o valor de `isLoggedIn` não mudasse.
import Cookies from 'js-cookie'; // caso surja erro, corrigir com quick-fix, ou: npm install --save-dev @types/js-cookie
import { Nav, Navbar } from 'react-bootstrap';
import HomeIcon from '../../assets/home.svg?react';
import SearchIcon from '../../assets/lupa.svg?react';
import AddIcon from '../../assets/plus.svg?react';
import LogoutIcon from '../../assets/left-from-bracket.svg?react';
import LogoBolosJacquinIcon from '../../assets/Bolos do Jacquin.svg?react';

export default function Header() {

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = useMemo(() => {
    return !!Cookies.get('auth_hash'); // substituir pelo nome do cookie, caso diferente
  }, []);

  const handleLogout = () => {
    Cookies.remove('auth_hash'); // Remove o cookie de autenticação; 
    navigate('/');
    window.location.reload(); // Recarrega a página para forçar re-render (alternativo a um state global)
  };


  const handleSearch = () => {
    if (!searchTerm.trim()) return; // ignora buscas vazias
    // console.log('Buscando por:', searchTerm);
    navigate(`/produtos/pesquisa?query=${encodeURIComponent(searchTerm)}`); //apenas executa o navigate concatenando a URL fixa de pesquisa com o termo pesquisado
    setSearchTerm("");
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header>
      <Navbar expand="md" className="container_geral container_header">

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            {/* 1/3: Icone página Home */}
            <Nav.Item>
              <Link to={"/"} title='Ir para a página inicial'>
                <HomeIcon className="icone_home" />
              </Link>
            </Nav.Item>

            {/* 2/3: Barra de pesquisa central */}
            <Nav.Item className="busca">
              <SearchIcon />
              <input
                className='input-pesquisa'
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="pesquisar"
              />
            </Nav.Item>

            {
              isLoggedIn ? (
                // 3/3: Se logado, botões para pg. Cadastro e Logout
                <Nav.Item className='botoes_direita'>
                  <Link className='botoes' to={"/produtos/cadastro"} title='Cadastrar novos bolos'>
                    <AddIcon height={26} className="add" />
                    <span>Cadastrar</span>
                  </Link>
                  <button className='botoes' onClick={handleLogout} title='Sair / Finalizar sessão'>
                    <LogoutIcon height={26} className="logoutIcon" />
                    <span>Logout</span>
                  </button>
                </Nav.Item>
              ) : (
                // 3/3: Se não logado, botão para pg. Login
                <Nav.Item>
                  <Link to={"/login"} title='Fazer login'>
                    <LogoBolosJacquinIcon className="logo_header" />
                  </Link>
                </Nav.Item>
              )
            }

          </Nav>
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
      </Navbar>

    </header>
  )
}
