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


export default function Produtos() {

  const [bolos, setBolos] = useState<Bolo[]>([]);
  const [cardapioCompleto, setCardapioCompleto] = useState<Bolo[]>([]);
  const [carregando, setCarregando] = useState(false);
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

      const dadosFormatados = cardapioCompleto.map(b => `
        Nome: ${b.nome}
        Categorias: ${b.categorias.join(", ")}
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
            Use os produtos fornecidos e mantenha o contexto da conversa. Caso não saiba responder alguma questão solicitada pelo usuário, peça para que ele procure ajuda em nosso canal de atendimento, via botão de whatsapp disponível na mesma tela, abaixo do chat onde você está funcionando.
            Seja breve e direto nas respostas.`
            },

            ...novoHistorico,

            {
              role: "system",
              content: `Produtos disponíveis:
            ${dadosFormatados}`
            }
          ],
          temperature: 0.5
        })
      });

      const data = await responseLm.json();
      return data?.choices?.[0]?.message?.content || "Sem resposta da IA";

    } catch {
      return "Erro ao consultar IA 😥";
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
    setCarregando(true);

    const respostaIA = await consultarIA(novoHistorico);

    setHistorico(prev => [
      ...prev,
      { role: "assistant", content: respostaIA }
    ]);

    setCarregando(false);
  };


  const fetchBolos = async () => {
    try {
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
    }
  }

  useEffect(() => {
    fetchBolos();
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [termo_pesquisado, historico, carregando])



  return (
    <>
      <Header />
      {mostrarChat && (
        <div style={{
          position: "fixed",
          bottom: 120,
          right: 40,
          width: 350,
          background: "#fff",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 10,
          zIndex: 99
        }}>

          <div className='chat_div'>
            <h4>Chat</h4>
            <svg onClick={() => setMostrarChat(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
          </div>

          <div style={{ maxHeight: 350, overflowY: "auto", marginTop: 10 }}>
            {historico.map((msg, index) => (
              <div ref={chatRef} key={index} style={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: 8
              }}>
                <span style={{
                  background: msg.role === "user" ? "#d1e7ff" : "#f1f1f1",
                  padding: 6,
                  borderRadius: 6,
                  display: "inline-block",
                  fontSize: "1.25rem"
                }}>
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          {carregando && (
            <div style={{ fontStyle: "italic", color: "#888", marginBottom: "2rem" }}>
              Digitando...
            </div>
          )}

          <input
            type="text"
            style={{ marginBottom: "1rem", marginTop: "1rem", padding: "5px", borderRadius: "5px", fontSize: "1.25rem" }}
            placeholder="Digite sua pergunta..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                enviarMensagem();
              }
            }}
          />



          <button
            style={{ padding: "5px", fontSize: "1.25rem", borderRadius: "5px", backgroundColor: "#FFD188" }}
            onClick={enviarMensagem}
          >
            Enviar
          </button>

        </div>
      )}

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
        <a className="chat"
          target="_blank">
          <img src={chatbot} onClick={() => setMostrarChat(true)} alt="icone do chatbot" />
        </a>
      </main>
      <Footer />
    </>
  )
}
