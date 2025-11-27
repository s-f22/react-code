import { BrowserRouter, Route, Routes } from "react-router-dom"
import Produtos from "./pages/Produtos/Produtos"
import Home from "./pages/Home/Home"
import Cadastro from "./pages/Cadastro/Cadastro"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/produtos/:categoria" element={ <Produtos /> } />
          <Route path="/produtos/pesquisa" element={ <Produtos /> } />
          <Route path="/produtos/cadastro" element={ <Cadastro /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
