import type { CardCategoriaProps } from "../types/CardCategoriaProps";
import CacauIcon from '../assets/cacau.svg?react';
import CerimoniasIcon from '../assets/aliancas.svg?react';
import MorangoIcon from '../assets/morango.svg?react';
import NatalIcon from '../assets/natal.svg?react';
import CocoIcon from '../assets/coco.svg?react';
import DestaquesIcon from '../assets/estrela.svg?react';

export const categorias: CardCategoriaProps[] = [
  {
    rota: "/produtos/chocolate",
    titulo: "Chocolate",
    classeCss: "card_cacau",
    svgIconeCategoria: <CacauIcon className="svg_cacau" />
  },
  {
    rota: "/produtos/cerimonias",
    titulo: "Cerimonias",
    classeCss: "card_cerimonias",
    svgIconeCategoria: <CerimoniasIcon className="svg_principal" />
  },
  {
    rota: "/produtos/morango",
    titulo: "Morango",
    classeCss: "card_morango",
    svgIconeCategoria: <MorangoIcon className="svg_principal" />
  },
  {
    rota: "/produtos/natal",
    titulo: "Natal",
    classeCss: "card_natal",
    svgIconeCategoria: <NatalIcon className="svg_principal" />
  },
  {
    rota: "/produtos/coco",
    titulo: "Coco",
    classeCss: "card_coco",
    svgIconeCategoria: <CocoIcon className="svg_principal" />
  },
  {
    rota: "/produtos/destaques",
    titulo: "Destaques",
    classeCss: "card_destaques",
    svgIconeCategoria: <DestaquesIcon className="svg_principal" />
  },
];