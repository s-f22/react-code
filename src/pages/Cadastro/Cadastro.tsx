import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import './Cadastro.css'
import type { Bolo } from '../../types/Bolo';
import { deleteBolo, enviarFotoParaAPI, getBolos, postBolo, putBolo } from '../../services/bolosService';
import { formatosService } from '../../services/formatosService';
import ModalCustomizado from '../../components/ModalCustomizado/ModalCustomizado';
import { NumericFormat } from 'react-number-format';
import EditIcon from '../../assets/pen-to-square.svg?react';
import UploadIcon from '../../assets/upload.svg?react';
import TrashIcon from '../../assets/trash-can.svg?react';

export default function Cadastro() {

  const [bolos, setBolos] = useState<Bolo[]>([]);
  const [clicouNaLixeira, setClicouNaLixeira] = useState<boolean>(false);
  const [idParaDeletar, setIdParaDeletar] = useState<string>("");
  const [idParaEditar, setIdParaEditar] = useState<string>("");
  const [aposConfirmacaoDeBoloRemovido, setAposConfirmacaoDeBoloRemovido] = useState<boolean>(false);
  const [propsModalDeErroOuSucesso, setPropsModalDeErroOuSucesso] = useState<{ exibir: boolean, titulo: string, corpo: string }>({ exibir: false, titulo: "", corpo: "" });
  const [nomeBolo, setNomeBolo] = useState<string>("");
  const [categorias, setCategorias] = useState<string>("");
  const [imagem, setImagem] = useState<File | undefined>();
  const [nomeDaImagem, setNomeDaImagem] = useState<string | undefined>();
  const [preco, setPreco] = useState<number | undefined>(undefined);
  const [peso, setPeso] = useState<number | undefined>(undefined);
  const [descricao, setDescricao] = useState<string>("");
  const [bgImageInputColor, setBgImageInputColor] = useState<string>("#ffffff");

  const topoRef = useRef<HTMLDivElement>(null);

  const focarTopo = () => {
    topoRef.current?.scrollIntoView({ behavior: "smooth" });
    topoRef.current?.focus();
  }

  const abrirModalParaConfirmarDelete = (id: string) => {
    setClicouNaLixeira(true);
    setIdParaDeletar(id);
  }

  const cancelarEdicao = () => {
    limparDados();
    setIdParaEditar("");
  }

  const editarBolo = (bolo: Bolo) => {
    focarTopo();
    setIdParaEditar(bolo.id!);

    setNomeBolo(bolo.nome);
    setDescricao(bolo.descricao ?? "");
    setPreco(bolo.preco);
    setPeso(bolo.peso ?? undefined);
    setCategorias(bolo.categorias.join(", "));

    setImagem(undefined);
    setNomeDaImagem(bolo.imagens[0]);

    setBgImageInputColor("#ffffff");
  };

  const fecharModalConfirmacaoDelete = () => {
    setClicouNaLixeira(false);
  }

  const fecharModalDeErroOuSucesso = () => {
    setPropsModalDeErroOuSucesso({ ...propsModalDeErroOuSucesso, exibir: false }); // ...spread operator
  }

  const exibirModalDeErroOuSucesso = (titulo: string, corpo: string) => {
    setPropsModalDeErroOuSucesso({ exibir: true, titulo, corpo });
  }

  const removerItemAposConfirmacao = async (id: string) => {
    try {
      await deleteBolo(id);
      setAposConfirmacaoDeBoloRemovido(true);
      await fetchBolos();
      fecharModalConfirmacaoDelete();
    } catch (error) {
      exibirModalDeErroOuSucesso("Erro", "Erro ao deletar o bolo");
    }
  }

  const fetchBolos = async () => {
    try {
      const dados = await getBolos();
      //console.log(dados);
      setBolos(dados);
    } catch (error) {
      console.error("Erro ao executar getBolos: ", error);
    }
  }

  const carregarImagem = (img: ChangeEvent<HTMLInputElement>) => {
    const file = img.target.files?.[0];
    if (file?.type.includes("image")) {
      setImagem(file);
      setBgImageInputColor("#5cb85c");
    }
    else {
      setImagem(undefined);
      setBgImageInputColor("#ff2c2c");
    }
  }

  const limparDados = () => {
    setNomeBolo("");
    setCategorias("");
    setImagem(undefined);
    setNomeDaImagem(undefined);
    setPreco(undefined);
    setPeso(undefined);
    setDescricao("");
    setBgImageInputColor("#ffffff");
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeBolo || !categorias || !preco) {
      exibirModalDeErroOuSucesso(
        "Campos obrigatórios",
        "Preencha o nome, categorias e preço do bolo"
      );
      return;
    }

    let uploadedFileName = nomeDaImagem;

    if (imagem) {
      uploadedFileName = await enviarFotoParaAPI(imagem);
    }


    const bolo: Bolo = {
      id: idParaEditar || undefined,
      nome: nomeBolo,
      descricao,
      preco,
      peso: peso ?? null,
      categorias: categorias.toLowerCase().split(",").map(c => c.trim()),
      imagens: uploadedFileName ? [uploadedFileName] : []
    };

    try {
      if (idParaEditar) {
        console.log("Entrou na edição", bolo);
        await putBolo(bolo);
        exibirModalDeErroOuSucesso("Sucesso", "Bolo atualizado!");
      } else {
        await postBolo(bolo);
        exibirModalDeErroOuSucesso("Sucesso", "Novo bolo cadastrado!");
      }

      limparDados();
      setIdParaEditar("");
      fetchBolos();
    } catch {
      exibirModalDeErroOuSucesso("Erro", "Erro ao salvar o bolo");
    }
  };


  useEffect(() => {
    fetchBolos();
  }, [])



  return (
    <>
      <Header />
      <main>
        <h1 className="acessivel">tela de cadastro e listagem de produtos</h1>

        <form onSubmit={handleSubmit} className="container_cadastro">
          {idParaEditar ? <h2>Editando item</h2> : <h2>Cadastro</h2>}
          <hr />

          <div ref={topoRef} tabIndex={-1} className="box_cadastro">
            <div className="cadastro_coluna1">
              <div className="bolos">
                <label htmlFor="bolo">Bolo</label>
                <input
                  type="text"
                  id="bolo"
                  placeholder='Insira o nome do bolo'
                  value={nomeBolo}
                  onChange={e => setNomeBolo(e.target.value)}
                />
              </div>

              <div className="categoria_img">
                <div className="categoria">
                  <label htmlFor="cat">Categoria</label>
                  <input
                    type="text"
                    id="cat"
                    placeholder='Chocolate, Morango, Coco...'
                    value={categorias}
                    onChange={c => setCategorias(c.target.value)}
                  />
                </div>
                <div className="img">
                  <label htmlFor="img">
                    <span>Imagem</span>
                    <div style={{ backgroundColor: bgImageInputColor }}>
                      <UploadIcon height={26} />
                    </div>
                  </label>
                  <input
                    type="file"
                    id="img"
                    accept='image/*'
                    onChange={carregarImagem}
                  />
                </div>
              </div>

              <div className="valor_peso">
                <div className="valor">
                  <label htmlFor="val">Valor</label>
                  <NumericFormat
                    id='val'
                    placeholder='Insira o preço (R$)'
                    value={preco ?? ""}
                    thousandSeparator="."
                    decimalSeparator=','
                    prefix='R$ '
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    onValueChange={(values) => {
                      setPreco(values.floatValue ?? undefined);
                    }}
                    inputMode='decimal'
                  />
                </div>

                <div className="peso">
                  <label htmlFor="peso">Peso</label>
                  <NumericFormat
                    id='peso'
                    placeholder='Inserir'
                    value={peso ?? ""}
                    thousandSeparator="."
                    decimalSeparator=','
                    decimalScale={3}
                    fixedDecimalScale
                    allowNegative={false}
                    suffix=' kg'
                    inputMode='decimal'
                    onValueChange={(values) => {
                      setPeso(values.floatValue ?? undefined);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="cadastro_coluna2">
              <label htmlFor="desc">Descrição</label>
              <textarea
                id="desc"
                maxLength={200}
                placeholder='Escreva detalhes sobre o bolo'
                value={descricao}
                onChange={d => setDescricao(d.target.value)}
              />
            </div>
          </div>
          <button className='botaoSubmit' type='submit'>
            {idParaEditar ? "Atualizar dados" : "Cadastrar novo bolo"}
          </button>
          {idParaEditar && <button onClick={cancelarEdicao} className='botaoModalCancelar'>Cancelar edição</button>}
        </form>

        <section className="container_lista">
          <h2>Lista</h2>
          <hr />

          <table>
            <thead>
              <tr>
                <th>Bolo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Peso</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {
                bolos.map((b: Bolo) => (
                  <tr>
                    <td data-cell="Bolo: ">{b.nome}</td>
                    <td data-cell="Categoria: "> {b.categorias.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")} </td>
                    <td data-cell="Descrição: ">{b.descricao || "Não informado"}</td>
                    <td data-cell="Valor: "> {formatosService.PrecoBR(b.preco)} </td>
                    <td data-cell="Peso: "> {b.peso ? formatosService.PesoEmKg(b.peso) : "Não cadastrado"} </td>
                    <td className='alinamentoIconesMobile'>
                      <EditIcon height={26} className='iconesEditDelete' onClick={() => editarBolo(b)} />
                    </td>
                    <td className='alinamentoIconesMobile'>
                      <TrashIcon height={30} className='iconesEditDelete' onClick={() => abrirModalParaConfirmarDelete(b.id!)} />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
      <ModalCustomizado
        mostrarModalQuando={clicouNaLixeira}
        aoCancelar={fecharModalConfirmacaoDelete}
        titulo='Confirmar exclusão'
        corpo='Tem certeza que deseja remover este item?'
        customizarBotoes={true}
        textoBotaoConfirmacao='Excluir'
        textoBotaoCancelamento='Cancelar'
        aoConfirmar={() => removerItemAposConfirmacao(idParaDeletar)}
        exibirConteudoCentralizado={true}
      />
      <ModalCustomizado
        mostrarModalQuando={aposConfirmacaoDeBoloRemovido}
        aoCancelar={() => setAposConfirmacaoDeBoloRemovido(false)}
        titulo='Sucesso'
        corpo='Bolo removido!'
      />
      <ModalCustomizado
        mostrarModalQuando={propsModalDeErroOuSucesso.exibir}
        aoCancelar={fecharModalDeErroOuSucesso}
        titulo={propsModalDeErroOuSucesso.titulo}
        corpo={propsModalDeErroOuSucesso.corpo}
        exibirConteudoCentralizado={true}
      />
    </>
  )
}
