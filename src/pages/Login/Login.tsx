import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // caso surja erro, corrigir com quick-fix, ou: npm install --save-dev @types/js-cookie
import './Login.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/users?email=${email}&senha=${password}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const authHash = btoa(email + Date.now());

        Cookies.set("auth_hash", authHash, { expires: 1 / 24 }); // 1 hora
        navigate("/produtos/cadastro");
      } else {
        setError("Email ou senha incorretos.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <>
      <Header />
      <section className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4 shadow-sm w-100">
          <h3 className="text-center mb-4">Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button type="submit" className="botaoSubmit w-100">
              Entrar
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
