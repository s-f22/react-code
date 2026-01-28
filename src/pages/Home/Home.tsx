import './Home.css'
import foto_jacquin from '../../assets/jacquin-masterchef.png';
import whatsapp_logo from '../../assets/whatsapp.png';
import { Link } from 'react-router-dom';
import { categorias } from '../../data/categorias';
import type { CardCategoriaProps } from '../../types/CardCategoriaProps';
import CardCategoria from '../../components/CardCategoria/CardCategoria';
import Footer from '../../components/Footer/Footer';
import LogoBolosJacquinIcon from '../../assets/Bolos do Jacquin.svg?react';

export default function Home() {

  return (
    <>
      <main className="main_home">
        <section className="secao_logo">
          <LogoBolosJacquinIcon />
          <img src={foto_jacquin} alt="foto do jacquin" />
        </section>

        <section className="secao_cards">
          <h1 className="acessivel">Pagina inicial</h1>
          {
            categorias.map((c: CardCategoriaProps) => (
              <CardCategoria
                key={c.titulo}
                rota={c.rota}
                titulo={c.titulo}
                classeCss={c.classeCss}
                svgIconeCategoria={c.svgIconeCategoria}
              />
            ))
          }

        </section>

        <Link to={"https://wa.me/5511999999999?text=Olá%20,%20gostaria%20de%20mais%20informações."} className="whatsapp" >
          <img src={whatsapp_logo} alt="icone do whatsapp" />
        </Link>
      </main>
      <Footer />
    </>
  )
}
