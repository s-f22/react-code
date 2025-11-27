import { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import './Cadastro.css'
import type { Bolo } from '../../types/Bolo';
import { getBolos } from '../../services/bolosService';

export default function Cadastro() {

  const [bolos, setBolos] = useState<Bolo[]>([]);

  const fetchBolos = async () => {
    try {
      const dados = await getBolos();
      console.log(dados);
      setBolos(dados);
    } catch (error) {
      console.error("Erro ao executar getBolos: ", error);
    }
  }

  useEffect(() => {
    fetchBolos();
  }, [])



  return (
    <>
      <Header />
      <main>
        <h1 className="acessivel">tela de cadastro e listagem de produtos</h1>

        <section className="container_cadastro">
          <h2>Cadastro</h2>
          <hr />

          <div className="box_cadastro">
            <div className="cadastro_coluna1">
              <div className="bolos">
                <label htmlFor="bolo">Bolo</label>
                <input type="text" name="" id="bolo" />
              </div>

              <div className="categoria_img">
                <div className="categoria">
                  <label htmlFor="cat">Categoria</label>
                  <input type="text" name="" id="cat" />
                </div>
                <div className="img">
                  <label htmlFor="img">
                    <span>Imagem</span>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                        <path fill="currentColor"
                          d="M232 344l0-316.7 106.3 106.3c3.1 3.1 8.2 3.1 11.3 0s3.1-8.2 0-11.3l-120-120c-3.1-3.1-8.2-3.1-11.3 0l-120 120c-3.1 3.1-3.1 8.2 0 11.3s8.2 3.1 11.3 0L216 27.3 216 344c0 4.4 3.6 8 8 8s8-3.6 8-8zm48-24l104 0c26.5 0 48 21.5 48 48l0 48c0 26.5-21.5 48-48 48L64 464c-26.5 0-48-21.5-48-48l0-48c0-26.5 21.5-48 48-48l104 0 0-16-104 0c-35.3 0-64 28.7-64 64l0 48c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-48c0-35.3-28.7-64-64-64l-104 0 0 16zm88 72a16 16 0 1 1 -32 0 16 16 0 1 1 32 0zm-16-32a32 32 0 1 0 0 64 32 32 0 1 0 0-64z" />
                      </svg>
                    </div>
                  </label>
                  <input type="file" name="" id="img" />
                </div>
              </div>

              <div className="valor_peso">
                <div className="valor">
                  <label htmlFor="val">Valor</label>
                  <input type="text" name="" id="val" />
                </div>

                <div className="peso">
                  <label htmlFor="peso">Peso</label>
                  <input type="text" name="" id="peso" />
                </div>
              </div>
            </div>

            <div className="cadastro_coluna2">
              <label htmlFor="desc">Descrição</label>
              <textarea name="" id="desc"></textarea>
            </div>
          </div>
          <input type="button" value="Cadastrar" />
        </section>

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
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {
                bolos.map((b: Bolo) => (
                  <tr>
                    <td data-cell="Bolo: ">{ b.nome }</td>
                    <td data-cell="Categoria: "> { b.categorias } </td>
                    <td data-cell="Descrição: ">{ b.descricao }</td>
                    <td data-cell="Valor: "> { b.preco } </td>
                    <td data-cell="Peso: "> { b.peso } </td>
                    <td>
                      <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640">
                        <path fill="currentColor"
                          d="M247.4 79.1C251 70 259.9 64 269.7 64L370.3 64C380.1 64 388.9 70 392.6 79.1L412.2 128L227.8 128L247.4 79.1zM210.6 128L104 128C99.6 128 96 131.6 96 136C96 140.4 99.6 144 104 144L536 144C540.4 144 544 140.4 544 136C544 131.6 540.4 128 536 128L429.4 128L407.5 73.1C401.4 58 386.7 48 370.3 48L269.7 48C253.3 48 238.6 58 232.6 73.1L210.6 128zM128 192L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 192L496 192L496 512C496 538.5 474.5 560 448 560L192 560C165.5 560 144 538.5 144 512L144 192L128 192zM224 264C224 259.6 220.4 256 216 256C211.6 256 208 259.6 208 264L208 472C208 476.4 211.6 480 216 480C220.4 480 224 476.4 224 472L224 264zM328 264C328 259.6 324.4 256 320 256C315.6 256 312 259.6 312 264L312 472C312 476.4 315.6 480 320 480C324.4 480 328 476.4 328 472L328 264zM432 264C432 259.6 428.4 256 424 256C419.6 256 416 259.6 416 264L416 472C416 476.4 419.6 480 424 480C428.4 480 432 476.4 432 472L432 264z" />
                      </svg>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
    </>
  )
}
