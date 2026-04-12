import type { CardProdutoProps } from '../../types/CardProdutoProps';
import './CardProduto.css';
import bolo_default from '../../assets/imgs/bolo-default.png';
import { formatosService } from '../../services/formatosService';


export default function CardProduto({ nome, descricao, preco, imagem, id, peso }: CardProdutoProps) {
  // console.log("Imagem: " + imagem);
  const imageUrl = imagem.length > 0
    ? `http://localhost:5103/${imagem}`
    : bolo_default;

  return (
    <div key={id} className="card_produto">
      <img src={imageUrl} alt={nome} />
      <h2>{nome}</h2>
      <p>{(descricao.length > 0) ? descricao : "Descrição não informada"}</p>
      <div>
        <span>{ formatosService.PrecoBR(preco) }</span>
        <br />
        <span>{ (peso != null) ? formatosService.PesoEmKg(peso) : "qtde não informada" }</span>
      </div>
    </div>
  )
}
