import { Link } from 'react-router-dom'
import './CardCategoria.css'
import type { CardCategoriaProps } from '../../types/CardCategoriaProps'
import PlusIcon from '../../assets/plus.svg?react';


export default function CardCategoria({ rota, titulo, classeCss, svgIconeCategoria }: CardCategoriaProps) {

  return (
    <Link to={rota} className={`card_categoria ${classeCss}`} >
      <PlusIcon height={30} />
      {svgIconeCategoria}
      <h2>{titulo}</h2>
    </Link>
  )
}
