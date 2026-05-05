import './Produtos.css';
import whatsapp from '../../assets/whatsapp.png';
import { useEffect, useState } from 'react';
import type { Bolo } from '../../types/Bolo';
import { getBolos } from '../../services/bolosService';
import CardProduto from '../../components/CardProduto/CardProduto';
import Carrossel from '../../components/Carrossel/Carrossel';
import Header from '../../components/Header/Header';
import { useLocation, useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import jacquin404 from '../../assets/jacquin-not-found.png';


export default function Produtos() {

  const [bolos, setBolos] = useState<Bolo[]>([]);
  const location = useLocation();
  const { categoria } = useParams<{ categoria: string }>();

  const parametrosPesquisados = new URLSearchParams(location.search);
  const termo_pesquisado = parametrosPesquisados.get('query');

  const fetchBolos = async () => {
    try {
      const dados = await getBolos();
      if (categoria) {
        const dados_filtrados = dados.filter(b =>
          b.categorias.some(cat =>
            cat.toLowerCase() === categoria.toLowerCase()));
        setBolos(dados_filtrados);
      }
      else if (termo_pesquisado) {
        const dados_filtrados = dados.filter(
          b => b.nome.toLowerCase()
            .includes(termo_pesquisado.toLowerCase()) ||
            b.descricao.toLowerCase()
              .includes(termo_pesquisado.toLowerCase()) ||
            b.categorias.some(
              cat => cat.toLowerCase()
                .includes(termo_pesquisado.toLowerCase())
            )
        )
        setBolos(dados_filtrados)
      } else {
        console.error("Nenhuma categoria ou termo de busca definidos.");
        setBolos([]);
      }
    } catch (error) {
      console.error("Erro ao executar getBolos: ", error)
    }
  }

  useEffect(() => {
    fetchBolos();
    // console.log("Termo pesquisado: ", termo_pesquisado);
  }, [termo_pesquisado])



  return (
    <>
      <Header />
      <main>
        <Carrossel />
        <section className="container_produtos">
          <h1 className="acessivel">produtos de chocolate</h1>
          <div className="titulo">
            <span>
              {
                categoria
                  ? categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()
                  : termo_pesquisado
                    ? `Resultados para: ${termo_pesquisado}`
                    : "Nenhum filtro aplicado"
              }
            </span>
            <hr />
          </div>

          <section className="cards">

            {
              bolos.map((b: Bolo) => (
                <CardProduto
                  nome={b.nome}
                  descricao={b.descricao}
                  preco={b.preco}
                  imagem={b.imagens[0] ?? ""}
                  peso={b.peso}
                />
              ))
            }
            {
              bolos.length == 0 &&
              <div className='jacquin404'>
                <h3>O termo pesquisado <br />não foi encontrado</h3>
                <img src={jacquin404} alt="foto_termo_nao_encontrado" />
              </div>
            }

          </section>
        </section>

        <a className="whatsapp" href="https://wa.me/5511999999999?text=Olá%20,%20gostaria%20de%20mais%20informações."
          target="_blank">
          <img src={whatsapp} alt="icone do whatsapp" />
        </a>
      </main>
      <Footer />
    </>
  )
}
