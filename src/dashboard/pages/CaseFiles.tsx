import { getCaseByIdService } from "../../services/case.services";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createCaseFileService,
  deleteCaseFileService,
  getCaseFilesService
} from "../../services/caseFile.service";
import Swal from "sweetalert2";
import { useAuth } from "../../components/hooks/AuthContext";
import Pagination from "../../components/common/Pagination";


const CaseFiles = () => {

  const { user } = useAuth();
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseInfo, setCaseInfo] = useState<any>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    name: "",
    url: "",
  });

  useEffect(() => {
    if (!caseId) return;
    if (!user?.id) return;

    loadFiles();
  }, [caseId, user, page]);

  useEffect(() => {
    loadCaseInfo();
  }, [caseId]);

  /* 👉 Cargar expedientes */
  const loadFiles = async () => {
    try {
      setLoadingFiles(true);

      Swal.fire({
        title: "Cargando expedientes...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getCaseFilesService(Number(caseId), page, 10),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setFiles(data.data);
      setTotalPages(data.totalPages);

    } catch (error) {

      Swal.fire("Error", "No se pudieron cargar los expedientes", "error");

    } finally {

      setLoadingFiles(false);
      Swal.close();

    }
  };

  const loadCaseInfo = async () => {
    try {
      const data = await getCaseByIdService(Number(caseId));
      setCaseInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* 👉 Crear expediente */
  const createFile = async () => {
    if (!form.name || !form.url) {
      Swal.fire("Error", "Completa los campos", "warning");
      return;
    }

    try {
      await createCaseFileService({
        ...form,
        caseId: Number(caseId),
        userId: user.id
      });

      await Swal.fire({
        icon: "success",
        title: "Expediente agregado",
        timer: 1400,
        showConfirmButton: false,
      });

      setForm({ name: "", url: "" });
      setIsModalOpen(false);
      loadFiles();

    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  /* 👉 Eliminar expediente */
  const deleteFile = async (id: number) => {

    Swal.fire({
      title: "¿Eliminar expediente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626",
    }).then(async (res) => {

      if (res.isConfirmed) {

        await deleteCaseFileService(id);

        if (files.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          loadFiles();
        }

        Swal.fire({
          icon: "success",
          title: "Expediente eliminado",
          timer: 1200,
          showConfirmButton: false,
        });

      }

    });
  };

  const isFormValid =
    form.name.trim() &&
    form.url.trim();

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Expedientes del caso - {caseInfo
              ? `${caseInfo.folio} · ${caseInfo.title} `
              : `Caso #${caseId}`}
          </h2>

          <p className="text-gray-600">
            {caseInfo
              ? `Cliente: ${caseInfo.client?.name} ${caseInfo.client?.lastName}`
              : `Caso #${caseId}`}
          </p>
          <p className="text-gray-600 mt-5">
            Documentación relacionada al asunto legal
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600"
          >
            ← Volver
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            <HiOutlinePlus />
            Nuevo expediente
          </button>
        </div>
      </div>

      {/* TABLA */}
      {loadingFiles ? (
        <div className="py-10 text-center text-gray-500">
          Cargando expedientes...
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">📂</div>
          <p className="font-semibold text-lg">
            No hay expedientes registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Nombre</th>
                  <th className="px-6 py-4 text-left">Subido por</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-center">Archivo</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {files.map((f, i) => (
                  <tr
                    key={f.id}
                    className={`
                  border-t transition
                  ${i % 2 === 0 ? "bg-white" : "bg-gray-200"}
                  hover:bg-primary/5
                `}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">
                      {f.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {f.user?.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(f.createdAt).toLocaleDateString("es-MX")}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Ver archivo
                      </a>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteFile(f.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </>
      )}

      {/* MODAL CREAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Nuevo expediente
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Nombre archivo *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Enlace del archivo (URL) *
                </label>
                <input
                  value={form.url}
                  onChange={(e) =>
                    setForm({ ...form, url: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-2">
                (*) Los campos son obligatorios.
              </p>

            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                disabled={!isFormValid}
                onClick={createFile}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Guardar expediente
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CaseFiles;