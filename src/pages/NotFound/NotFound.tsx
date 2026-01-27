import './NotFound.css';
import jacquin from '../../assets/jacquin_page_404.png';
import { useNavigate } from 'react-router-dom';

function NotFound() {

  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
  }

  return (
    <div className="notfound">
      <h1>Ooops... página não <br /> encontrada</h1>
      <img src={jacquin} alt="" />
      <span>404 - Not Found</span>
      <button className='botaoSubmit' onClick={voltar}>Voltar</button>
    </div>
  );
}

export default NotFound;