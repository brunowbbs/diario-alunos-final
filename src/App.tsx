import axios from "axios";
import { LiaEdit } from "react-icons/lia";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

import { useState, useEffect } from "react";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
//GET
//POST
//DELETE
//PUT

type Aluno = {
  _id: string;
  bimestre: string;
  matricula: string;
  nome: string;
  curso: string;
};

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    curso: "",
    bimestre: "",
  });

  const [idParaEdicao, setIdParaEdicao] = useState("");

  const [errorNome, setErroNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  //const [nome, setNome] = useState("")

  async function salvarAluno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.nome === "") {
      setErroNome("Campo é obrigatório");
      //alert("Nome é obrigatório");
    } else {
      setErroNome("");

      if (idParaEdicao) {
        try {
          await axios.put(
            `https://api-aluno.vercel.app/aluno/${idParaEdicao}`,
            {
              nome: formData.nome,
              matricula: formData.matricula,
              curso: formData.curso,
              bimestre: formData.bimestre,
            }
          );
          buscarAlunos();
          toast("Aluno Editado com sucesso");

          setIdParaEdicao("");
        } catch (error: any) {
          toast("Erro ao cadastrar um aluno");
        }
      } else {
        try {
          await axios.post("https://api-aluno.vercel.app/aluno", {
            nome: formData.nome,
            matricula: formData.matricula,
            curso: formData.curso,
            bimestre: formData.bimestre,
          });
          buscarAlunos();
          toast("Aluno Cadastrado com sucesso");
        } catch (error: any) {
          toast("Erro ao cadastrar um aluno");
        }
      }

      setFormData({ nome: "", matricula: "", bimestre: "", curso: "" });
    }
  }

  async function buscarAlunos() {
    setIsLoading(true);
    const response = await axios.get("https://api-aluno.vercel.app/aluno");
    setAlunos(response.data);
    setIsLoading(false);
  }

  async function removerAluno(id: string) {
    try {
      await axios.delete(`https://api-aluno.vercel.app/aluno/${id}`);
      buscarAlunos();
      toast("aluno removido com sucesso");
    } catch (error) {
      toast("Erro ao remover aluno");
    }
  }

  function preencherEstado(aluno: Aluno) {
    setFormData({
      nome: aluno.nome,
      matricula: aluno.matricula,
      bimestre: aluno.bimestre,
      curso: aluno.curso,
    });

    setIdParaEdicao(aluno._id);
  }

  useEffect(() => {
    buscarAlunos();
  }, []);

  return (
    <div className="home">
      <div className="container_form">
        <h1 className="title_home">Diário eletrônico</h1>
        <form className="form" onSubmit={(event) => salvarAluno(event)}>
          <div className="container_input">
            <input
              placeholder="Name"
              value={formData.nome}
              onChange={(event) =>
                setFormData({ ...formData, nome: event.target.value })
              }
            />
            <span className="error">{errorNome}</span>
          </div>

          <div className="container_input">
            <input
              placeholder="Matricula"
              value={formData.matricula}
              onChange={(event) =>
                setFormData({ ...formData, matricula: event.target.value })
              }
            />
            <span className="error"></span>
          </div>

          <div className="container_input">
            <select
              value={formData.curso}
              onChange={(event) =>
                setFormData({ ...formData, curso: event.target.value })
              }
            >
              <option selected> Selecione um curso</option>
              <option>Back-end</option>
              <option>Front-end</option>
              <option>Artes</option>
              <option>Biologia</option>
            </select>
            <span className="error"></span>
          </div>

          <div className="container_input">
            <input
              placeholder="Bimestre"
              value={formData.bimestre}
              onChange={(event) =>
                setFormData({ ...formData, bimestre: event.target.value })
              }
            />
            <span className="error"></span>
          </div>

          <button className="btn_save_form">Salvar</button>
        </form>
      </div>

      <div className="container_table">
        <h2>Alunos Cadastrados</h2>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <table border={1} className="table_alunos">
            <tr>
              <th className="flex-0">Ordem</th>
              <th className="flex-2">Nome</th>
              <th className="flex-1">Matrícula</th>
              <th className="flex-1">Curso</th>
              <th className="flex-1">Bimestre</th>
              <th className="flex-1">Ações</th>
            </tr>

            {alunos.map((aluno, index) => {
              return (
                <tr key={aluno._id}>
                  <td className="flex-0">{index + 1}</td>
                  <td className="flex-2">{aluno.nome}</td>
                  <td className="flex-1">{aluno.matricula}</td>
                  <td className="flex-1">{aluno.curso}</td>
                  <td className="flex-1">{aluno.bimestre}</td>
                  <td className="flex-1">
                    <MdDelete
                      color="F90000"
                      size={25}
                      onClick={() => removerAluno(aluno._id)}
                    />

                    <LiaEdit
                      color="#0FBA3F"
                      size={25}
                      onClick={() => preencherEstado(aluno)}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
