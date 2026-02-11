import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { createCaseService, deleteCaseService, getCaseService, updateCaseService } from "../../services/case.services";
import { getClientsService } from "../../services/client.service";
import { getUsersService } from "../../services/user.services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string }
> = {
  "POR_INICIAR": {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  "PROCESO": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  "RESUELTO": {
    bg: "bg-green-100",
    text: "text-green-700",
  },
  "ARCHIVADO": {
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};
const STATUS_LABELS: Record<string, string> = {
  POR_INICIAR: "Por iniciar",
  PROCESO: "En proceso",
  RESUELTO: "Resuelto",
  ARCHIVADO: "Archivado",
};

const Cases = () => {

  const navigate = useNavigate();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    folio: "",
    area: "",
    description: "",
    status: "",
    clientId: "",
    lawyerId: ""
  });
  const emptyForm = {
    title: "",
    folio: "",
    area: "",
    description: "",
    status: "POR_INICIAR",
    clientId: "",
    lawyerId: ""
  }


  useEffect(() => {
    loadCases();
    loadClients();
    loadUsers();
  }, []);

  const loadCases = async () => {
    try {
      Swal.fire({
        title: "Cargando asuntos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const [data] = await Promise.all([
        getCaseService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      console.log("---> Asuntos cargados:", data);
      setCases(data);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los asuntos", "error");
    } finally {
      Swal.close();
    }
  };

  const loadClients = async () => {
    try {
      const [data] = await Promise.all([
        getClientsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      console.log("---> Clientes cargados:", data);
      setClients(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    } finally {
      Swal.close();
    }
  };

  const loadUsers = async () => {
    try {
      const [data] = await Promise.all([
        getUsersService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      console.log("---> Usuarios cargados:", data);
      setUsers(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      Swal.close();
    }
  };

  const formatStatus = (status: string) => {
    return STATUS_LABELS[status] || status;
  };

  const createCase = async () => {
    await createCaseService({
      ...form,
      clientId: Number(form.clientId),
      lawyerId: Number(form.lawyerId),
    });

    await Swal.fire({
      icon: "success",
      title: "Asunto creado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const updateCase = async () => {
    if (!editingCase) return;

    await updateCaseService(editingCase.id, {
      ...form,
      clientId: Number(form.clientId),
      lawyerId: Number(form.lawyerId),
    });

    await Swal.fire({
      icon: "success",
      title: "Asunto editado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const saveCase = async () => {
    try {
      if (!form.title || !form.clientId || !form.lawyerId) {
        await Swal.fire("Error", "Completa los campos", "warning");
        return;
      }

      editingCase ? await updateCase() : await createCase();
      setForm(emptyForm);
      setEditingCase(null);
      setIsModalOpen(false);
      loadCases();

    } catch (error) {
      console.error(error);
      await Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  const openEditCase = (caseItem: any) => {
    setEditingCase(caseItem);

    setForm({
      folio: caseItem.folio || "",
      area: caseItem.area || "",
      title: caseItem.title || "",
      description: caseItem.description || "",
      status: caseItem.status || "POR_INICIAR",
      clientId: caseItem.clientId || "",
      lawyerId: caseItem.lawyerId || "",
    });

    setIsModalOpen(true);
  };


  const deleteCase = (id: number) => {
    Swal.fire({
      title: "¿Eliminar asunto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCaseService(id);
          // Actualizar lista local
          setCases((prev) => prev.filter((c) => c.id !== id));

          Swal.fire({
            icon: "success",
            title: "Asunto eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el asunto",
          });
        }
      }
    });
  };

  const changeCaseStatus = async (caseItem: any, newStatus: string) => {
    try {
      await updateCaseService(caseItem.id, {
        ...caseItem,
        status: newStatus,
        clientId: Number(caseItem.clientId),
        lawyerId: Number(caseItem.lawyerId),
      });

      await Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1200,
        showConfirmButton: false,
      });

      setStatusModalOpen(false);
      loadCases();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar estado", "error");
    }
  };

  const openStatusModal = (caseItem: any) => {
    setSelectedCase(caseItem);
    setStatusModalOpen(true);
  };



  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Asuntos</h1>
          <p className="text-gray-600">
            Gestión de expedientes y casos legales
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo asunto
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Folio</th>
              <th className="px-6 py-4 text-left">Asunto</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Area</th>
              <th className="px-6 py-4 text-left">Abogado</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-center">Expedientes</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cases.map((a, index) => (
              <tr
                key={a.id}
                className={`
                border-t transition
                ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                hover:bg-primary/5
              `}
              >
                <td className="px-6 py-4 font-semibold text-primary">
                  {a.folio}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {a.title}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.client.name + " " + a.client.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.area}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.lawyer.name}
                </td>

                <td
                  className="px-6 py-4"
                >
                  <span
                    onClick={() => openStatusModal(a)}
                    className={`
                    inline-flex items-center
                    px-3 py-1 rounded-full
                    text-xs font-semibold capitalize uppercase
                    ${STATUS_STYLES[a.status]?.bg}
                    ${STATUS_STYLES[a.status]?.text}
                  `}
                  >
                    {formatStatus(a.status)} <MdKeyboardArrowDown size={25} />
                  </span>
                </td>

                <td className="text-gray-600 text-center" >
                  <button
                    className="text-blue-500 hover:text-blue-600"
                     onClick={() => navigate(`/dashboard/asuntos/${a.id}/expedientes`)}
                  >
                    <FaRegFileAlt size={20} />
                  </button>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      className="text-primary hover:text-secondary"
                      onClick={() => openEditCase(a)}
                    >
                      <HiOutlinePencil size={22} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteCase(a.id)}
                    >
                      <HiOutlineTrash size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL – Crear / Editar Asunto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Nuevo asunto
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Folio
                </label>
                <input
                  type="text"
                  value={form.folio}
                  onChange={(e) =>
                    setForm({ ...form, folio: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. LAB-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Área legal
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  value={form.area}
                  onChange={(e) =>
                    setForm({ ...form, area: e.target.value })
                  }>
                  <option value="Derecho Laboral">Derecho Laboral</option>
                  <option value="Derecho Civil">Derecho Civil</option>
                  <option value="Derecho Penal">Derecho Penal</option>
                  <option value="Derecho Mercantil">Derecho Mercantil</option>
                  <option value="Derecho Familiar">Derecho Familiar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título del asunto
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. Audiencia laboral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripcion del asunto
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. La empresa ofrece 3 meses de salario; el trabajador pide 4. Si no hay acuerdo, se procede al juicio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente
                </label>
                <select
                  value={form.clientId}
                  onChange={(e) =>
                    setForm({ ...form, clientId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona cliente</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Abogado responsable
                </label>
                <select
                  value={form.lawyerId}
                  onChange={(e) =>
                    setForm({ ...form, lawyerId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona abogado</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>


            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>

              <button
                onClick={saveCase}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-white"
              >
                Guardar asunto
              </button>
            </div>

          </div>
        </div>
      )}

      {statusModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Cambiar estado
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-3">
              {Object.keys(STATUS_STYLES).map((status) => (
                <button
                  key={status}
                  onClick={() => changeCaseStatus(selectedCase, status)}
                  className={`
              w-full px-4 py-3 rounded-lg text-sm font-semibold
              border transition uppercase
              ${STATUS_STYLES[status].bg}
              ${STATUS_STYLES[status].text}
              hover:scale-[1.02]
            `}
                >
                  {formatStatus(status)}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t text-right">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;