import axios from "axios";
import type { Bolo } from "../types/Bolo";

const API_BASE = "http://localhost:5103/api";

// Função para pegar cookie pelo nome
const getCookie = (nome: string): string | null => {
  const valor = `; ${document.cookie}`;
  const partes = valor.split(`; ${nome}=`);

  if (partes.length === 2) {
    return partes.pop()?.split(";").shift() ?? null;
  }

  return null;
};

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getBolos = async (): Promise<Bolo[]> => {
  try {
    const resposta = await api.get("/bolos");
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar os dados: ", error);
    throw error;
  }
};

export const deleteBolo = async (idBolo: string): Promise<void> => {
  try {
    await api.delete(`/bolos/${idBolo}`);
  } catch (error) {
    console.error("Erro ao deletar o bolo: ", error);
    throw error;
  }
};

export const enviarFotoParaAPI = async (
  file: File
): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.caminhoImagem ?? res.data.CaminhoImagem;
  } catch (error) {
    console.error("Erro no upload da imagem: ", error);
    return undefined;
  }
};

export const postBolo = async (bolo: Bolo): Promise<void> => {
  try {
    await api.post("/bolos", bolo);
  } catch (error) {
    console.error("Erro ao cadastrar o bolo", error);
    throw error;
  }
};

export const putBolo = async (bolo: Bolo): Promise<void> => {
  try {
    if (!bolo.id) {
      throw new Error("ID do bolo não informado");
    }

    await api.put(`/bolos/${bolo.id}`, bolo);
  } catch (error) {
    console.error("Erro ao atualizar o bolo", error);
    throw error;
  }
};