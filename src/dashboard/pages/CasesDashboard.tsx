import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { getClientsService } from "../../services/client.service";
import { getUsersService } from "../../services/user.services";
import Pagination from "../../components/common/Pagination";
import { MdKeyboardArrowDown } from "react-icons/md";
import { VscFolderActive } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuFileDown } from "react-icons/lu";
import {
  createCaseService,
  deleteCaseService,
  getCasesPaginationService,
  updateCaseService
} from "../../services/case.services";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAuth } from "../../components/hooks/AuthContext";

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

const LEGAL_AREAS = [
  "Derecho Penal",
  "Derecho Laboral",
  "Derecho Familiar",
  "Derecho Corporativo",
  "Derecho Civil",
  "Derecho Mercantil",
  "Derecho Fiscal",
  "Derecho Administrativo",
  "Derecho Inmobiliario",
  "Derecho Migratorio",
];

const STATUS_LABELS: Record<string, string> = {
  POR_INICIAR: "Por iniciar",
  PROCESO: "En proceso",
  RESUELTO: "Resuelto",
  ARCHIVADO: "Archivado",
};

const emptyForm = {
  title: "",
  folio: "",
  area: "",
  description: "",
  status: "POR_INICIAR",
  clientId: "",
  lawyerId: "",
  authority: "",
  guests: [] as { value: string; label: string }[],
}


const CasesDashboard = () => {

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCases();
  }, [page, showArchived, search]);

  useEffect(() => {
    if (!user?.id) return;
    loadClients();
    loadUsers();
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // 👈 reset página al buscar
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const loadCases = async () => {
    try {
      setLoadingCases(true);

      const data = await getCasesPaginationService(
        page,
        10,
        showArchived,
        search
      );

      setCases(data.data);
      setTotalPages(data.totalPages);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los asuntos", "error");
    } finally {
      setLoadingCases(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClientsService();
      setClients(data);
    } catch (error) {
      console.error("Error", "No se pudieron cargar los clientes", "error")
    }

  };

  const loadUsers = async () => {
    try {
      const data = await getUsersService();
      setUsers(data);
    } catch (error) {
      console.error("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const formatStatus = (status: string) => {
    return STATUS_LABELS[status] || status;
  };

  const createCase = async () => {

    console.log("Payload", {
      ...form,
      clientId: Number(form.clientId),
      lawyerId: Number(form.lawyerId),
    });

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
      authority: caseItem.authority || "",
      guests: caseItem.guests || []
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

        await deleteCaseService(id);

        // si era el último registro de la página
        if (cases.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          loadCases();
        }

        Swal.fire({
          icon: "success",
          title: "Asunto eliminado",
          timer: 1500,
          showConfirmButton: false,
        });

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

  const guestOptions = users
    .filter((u: any) => String(u.id) !== String(form.lawyerId))
    .map((u: any) => ({
      value: u.id,
      label: u.name,
    }));

  const isFormValid =
    form.folio?.trim() &&
    form.area &&
    form.title?.trim() &&
    form.clientId &&
    form.lawyerId;


  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">


        {/* IZQUIERDA */}
        <div>
          <h1 className="text-2xl font-bold text-primary">Asuntos</h1>
          <p className="text-gray-600">
            Gestión de expedientes y casos legales
          </p>
        </div>

        {/* DERECHA (BOTONES) */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setPage(1);
            }}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
              ${showArchived
                ? "bg-gray-200 text-gray-700"
                : "bg-primary/10 text-primary"
              }
            `}
          >
            {showArchived
              ? <VscFolderActive size={18} />
              : <LuFileDown size={18} />}
            {showArchived ? "Ver activos" : "Ver archivados"}
          </button>

          <button
            onClick={() => {
              setEditingCase(null);
              setForm(emptyForm);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            <HiOutlinePlus />
            Nuevo asunto
          </button>

        </div>

      </div>

      <div className="relative w-full max-w-sm">

        <input
          type="text"
          placeholder="Buscar asunto..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-4 py-2 pr-10 rounded-lg w-full"
        />

        {/* ❌ LIMPIAR */}
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}

      </div>

      {/* Tabla */}
      {loadingCases ? (
        <div className="py-10 text-center text-gray-500">
          Cargando asuntos...
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">💼</div>

          <p className="font-semibold text-lg">
            {search
              ? "No se encontraron resultados"
              : "No hay asuntos registrados"}
          </p>

          <p className="text-sm">
            {search
              ? "Intenta con otro término de búsqueda"
              : "Cuando agregues uno aparecerá aquí."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">No. expediente</th>
                  <th className="px-6 py-4 text-left">Area</th>
                  <th className="px-6 py-4 text-left">Autoridad</th>
                  <th className="px-6 py-4 text-left">Cliente</th>
                  <th className="px-6 py-4 text-left">Descripción</th>
                  <th className="px-6 py-4 text-left">Abogado responsable</th>
                  <th className="px-6 py-4 text-left">Abogado(s) invitado(s)</th>
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

                    <td className="px-6 py-4 text-gray-600">
                      {a.area}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {a.authority ? a.authority : <span className="text-gray-400 italic">Sin autoridad</span>}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {a.client.name + " " + a.client.lastName}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {a.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {a.lawyer.name}
                    </td>

                    <td className="px-6 py-4">
                      {a.guests?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {a.guests.map((g: any, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                            >
                              {g.name ?? g.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Sin invitados</span>
                      )}
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
                          disabled={a.lawyerId !== user?.id}
                          onClick={() => openEditCase(a)}
                          className={`
                            ${a.lawyerId === user?.id
                              ? "text-primary hover:text-secondary"
                              : "text-gray-300 cursor-not-allowed"
                            }
                          `}
                        >
                          <HiOutlinePencil size={22} />
                        </button>

                        <button
                          disabled={a.lawyerId !== user?.id}
                          onClick={() => deleteCase(a.id)}
                          className={`
                            ${a.lawyerId === user?.id
                              ? "text-red-500 hover:text-red-600"
                              : "text-gray-300 cursor-not-allowed"
                            }
                          `}
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
          {/* PAGINACIÓN */}
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      {/* MODAL – Crear / Editar Asunto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                {editingCase ? "Editar asunto" : "Nuevo asunto"}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-6 overflow-y-auto">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Número de expediente *
                </label>
                <input
                  type="text"
                  value={form.folio}
                  onChange={(e) =>
                    setForm({ ...form, folio: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. 5622/2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Autoridad
                </label>
                <input
                  type="text"
                  value={form.authority}
                  onChange={(e) =>
                    setForm({ ...form, authority: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. Juzgado mayor de La Piedad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Área legal *
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  value={form.area}
                  onChange={(e) =>
                    setForm({ ...form, area: e.target.value })
                  }>
                  <option value="">Selecciona un área legal</option>
                  {LEGAL_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                  <option value="Otras">Otras</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente *
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
                  Título *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. Despido injustificado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripción
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
                  Abogado responsable *
                </label>
                <select
                  value={form.lawyerId}
                  onChange={(e) => {
                    const lawyerId = e.target.value;

                    setForm({
                      ...form,
                      lawyerId,
                      guests: form.guests?.filter(
                        (g: any) => String(g.value) !== String(lawyerId)
                      ),
                    });
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona abogado</option>

                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Invitados */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Abogados invitados
                </label>
                <Select
                  isMulti
                  options={guestOptions}
                  value={form.guests}
                  onChange={(g) =>
                    setForm({ ...form, guests: g as any })
                  }
                  placeholder="Selecciona invitados"
                />
              </div>


              <label className="text-sm font-semibold text-gray-700">
                (*) Los campos son obligatorios.
              </label>

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
                disabled={!isFormValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {editingCase ? "Guardar cambios" : "Crear asunto"}
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

export default CasesDashboard;