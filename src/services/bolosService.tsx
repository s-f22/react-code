import axios from "axios";
import type { Bolo } from "../types/Bolo";

export const getBolos = async (): Promise<Bolo[]> => {
  try {
    const resposta = await axios.get("http://localhost:3000/bolos");
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar os dados: ", error);
    throw error;
  }
}

export const deleteBolo = async (idBolo: string): Promise<void> => {
  try {
    await axios.delete(`http://localhost:3000/bolos/${idBolo}`);
  } catch (error) {
    console.error("Erro ao deletar o bolo: ", error);
    throw error;
  }
}

export const enviarFotoParaAPI = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:3000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.filename;
  } catch (error) {
    console.error("Erro no upload da imagem: ", error);
    return undefined;
  }

}