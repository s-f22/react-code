import axios from "axios";
import type { Bolo } from "../types/Bolo";

const API_BASE = "http://localhost:5103/api";

export const getBolos = async (): Promise<Bolo[]> => {
  try {
    const resposta = await axios.get(`${API_BASE}/bolos`);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar os dados: ", error);
    throw error;
  }
}

export const deleteBolo = async (idBolo: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/bolos/${idBolo}`);
  } catch (error) {
    console.error("Erro ao deletar o bolo: ", error);
    throw error;
  }
}

export const enviarFotoParaAPI = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.caminhoImagem ?? res.data.CaminhoImagem;
  } catch (error) {
    console.error("Erro no upload da imagem: ", error);
    return undefined;
  }
}

export const postBolo = async (bolo: Bolo): Promise<void> => {
  try {
    await axios.post(`${API_BASE}/bolos`, bolo);
  } catch (error) {
    console.error("Erro ao cadastrar o bolo", error);
    throw error;
  }
}

export const putBolo = async (bolo: Bolo): Promise<void> => {
  try {
    if (!bolo.id) {
      throw new Error("ID do bolo não informado");
    }
    await axios.put(`${API_BASE}/bolos/${bolo.id}`, bolo);
  } catch (error) {
    console.error("Erro ao atualizar o bolo", error);
    throw error;
  }
}
