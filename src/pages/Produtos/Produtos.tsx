import './Produtos.css';
import whatsapp from '../../assets/whatsapp.png';
import chatbot from '../../assets/chat.png';
import { useEffect, useRef, useState } from 'react';
import type { Bolo } from '../../types/Bolo';
import { getBolos } from '../../services/bolosService';
import CardProduto from '../../components/CardProduto/CardProduto';
import Carrossel from '../../components/Carrossel/Carrossel';
import Header from '../../components/Header/Header';
import { useLocation, useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import jacquin404 from '../../assets/jacquin-not-found.png';
import type { MensagemChat } from '../../types/MensagemChat';
import CloseIcon from '../../assets/xmark-solid-full.svg?react';
import Spinner from 'react-bootstrap/Spinner';


export default function Produtos() {

  const [bolos, setBolos] = useState<Bolo[]>([]);
  const [cardapioCompleto, setCardapioCompleto] = useState<Bolo[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [ia_respondendo, set_ia_respondendo] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState<MensagemChat[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { categoria } = useParams<{ categoria: string }>();

  const parametrosPesquisados = new URLSearchParams(location.search);
  const termo_pesquisado = parametrosPesquisados.get('query');


  const consultarIA = async (novoHistorico: MensagemChat[]) => {
    try {

      const dadosFormatados = "Catálogo completo de Produtos: \n" + cardapioCompleto.map(b => `
        Nome: ${b.nome}
        Categorias do bolo: ${b.categorias.join(", ")}
        Preço: ${b.preco}
        Descrição: ${b.descricao ?? "Sem descrição"}
        Peso: ${b.peso}
      `)
        .join("\n---\n");

      const responseLm = await fetch("http://localhost:1234/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "local-model",
          messages: [
            {
              role: "system",
              content: `Você é um assistente que deve fornecer informações sobre os produtos de uma confeitaria.
            Use os dados fornecidos no Catálogo completo de Produtos e mantenha o contexto da conversa. Caso não saiba responder alguma questão solicitada pelo usuário, peça para que ele procure ajuda em nosso canal de atendimento, via botão de whatsapp.
            Seja breve e direto nas respostas. Não utilize markdown, apenas texto simples. Para preços, utilize R$ como unidade. Para pesos, utilize kg como unidade.`
            },

            ...novoHistorico,

            {
              role: "system",
              content: `Produtos disponíveis:
            ${dadosFormatados}`
            }
          ],
          temperature: 0.2
        })
      });

      const data = await responseLm.json();
      return data?.choices?.[0]?.message?.content || "Sem resposta da IA";

    } catch {
      return "Erro ao consultar IA";
    }
  };


  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const novoHistorico: MensagemChat[] = [
      ...historico,
      { role: "user", content: mensagem }
    ];

    setHistorico(novoHistorico);
    setMensagem("");
    set_ia_respondendo(true);

    const respostaIA = await consultarIA(novoHistorico);

    setHistorico(prev => [
      ...prev,
      { role: "assistant", content: respostaIA }
    ]);

    set_ia_respondendo(false);
  };


  const fetchBolos = async () => {
    try {
      setCarregandoProdutos(true);
      const dados = await getBolos();
      setCardapioCompleto(dados);
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
    } finally {
      setCarregandoProdutos(false);
    }
  }

  useEffect(() => {
    fetchBolos();
  }, [termo_pesquisado, categoria]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico, ia_respondendo]);



  return (
    <>
      <Header />
      <Carrossel />
      <main>
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

          {
            carregandoProdutos ? (
              <div className="spinner-container">
                <Spinner animation="grow" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </Spinner>
              </div>
            ) : (
              <section className="cards">

                {
                  bolos.map((b: Bolo, index: number) => (
                    <CardProduto
                      key={index}
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
            )
          }

        </section>

        <a className="chat_icon"
          target="_blank">
          <img src={chatbot} onClick={() => setMostrarChat(true)} alt="icone do chatbot" />
        </a>

        <a className="whatsapp" href="https://wa.me/5511999999999?text=Olá%20,%20gostaria%20de%20mais%20informações."
          target="_blank">
          <img src={whatsapp} alt="icone do whatsapp" />
        </a>
      </main>

      {
        mostrarChat && (
          <div className='chat_box'>

            <div className='chat_title'>
              <h4>Chat</h4>
              <CloseIcon onClick={() => setMostrarChat(false)} />
            </div>

            <div className='chat_container_conversa'>
              {
                historico.map((msg, index) => (
                  <div ref={chatRef} key={index} style={{
                    textAlign: msg.role === "user" ? "right" : "left"
                  }}>
                    <span style={{
                      background: msg.role === "user" ? "#FFD188" : "#FFFFFF",
                      border: "1px solid lightgray"
                    }}>
                      {msg.content}
                    </span>
                  </div>
                ))
              }
            </div>

            {
              ia_respondendo && (
                <div className='chat_respondendo'>
                  Digitando...
                </div>
              )
            }

            <input
              type="text"
              className='chat_input'
              placeholder="Digite sua pergunta..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  enviarMensagem();
              }
              }
            />

            <button
              className='chat_botao_enviar'
              onClick={enviarMensagem}
            >
              Enviar
            </button>

          </div>
        )
      }

      <Footer />
    </>
  )
}
