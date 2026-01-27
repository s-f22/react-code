import { BrowserRouter, Route, Routes } from "react-router-dom"
import Produtos from "./pages/Produtos/Produtos"
import Home from "./pages/Home/Home"
import Cadastro from "./pages/Cadastro/Cadastro"
import RotaProtegida from "./components/RotaProtegida/RotaProtegida"
import Login from "./pages/Login/Login"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/produtos/:categoria" element={<Produtos />} />
          <Route path="/produtos/pesquisa" element={<Produtos />} />
          <Route path="/produtos/cadastro" element={
            <RotaProtegida>
              <Cadastro />
            </RotaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
