import { useEffect, useState } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi";
import Swal from "sweetalert2";

import {
    getAllSuccessCasesService,
    createSuccessCaseService,
    updateSuccessCaseService,
    deleteSuccessCaseService,
} from "../../services/successCase.service";

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

const SuccessCases = () => {

    const [cases, setCases] = useState<any[]>([]);
    const [loadingCases, setLoadingCases] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<any>(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
        area: "",
        order: 0
    });

    /* 👉 Cargar casos */
    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            setLoadingCases(true);

            Swal.fire({
                title: "Cargando casos...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const [data] = await Promise.all([
                getAllSuccessCasesService(),
                new Promise((resolve) => setTimeout(resolve, 700)),
            ]);
            setCases(data);

        } catch {
            Swal.fire("Error", "No se pudieron cargar", "error");
        } finally {
            setLoadingCases(false);
            Swal.close();
        }
    };

    /* 👉 Guardar */
    const handleSaveCase = async () => {

        if (!form.title || !form.description || !form.imageUrl) {
            return Swal.fire("Error", "Completa los campos", "warning");
        }

        try {

            const payload = {
                title: form.title,
                description: form.description,
                imageUrl: form.imageUrl,
                area: form.area,
                order: Number(form.order)
            };

            if (editingCase) {

                await updateSuccessCaseService(editingCase.id, payload);

                await Swal.fire({
                    icon: "success",
                    title: "Caso actualizado",
                    timer: 1400,
                    showConfirmButton: false,
                });

            } else {

                await createSuccessCaseService(payload);

                await Swal.fire({
                    icon: "success",
                    title: "Caso creado",
                    timer: 1400,
                    showConfirmButton: false,
                });

            }

            setIsModalOpen(false);
            setEditingCase(null);

            setForm({
                title: "",
                description: "",
                imageUrl: "",
                area: "",
                order: 0
            });

            loadCases();

        } catch {
            Swal.fire("Error", "No se pudo guardar", "error");
        }
    };

    /* 👉 Eliminar */
    const handleDelete = (id: number) => {

        Swal.fire({
            title: "¿Eliminar caso?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#dc2626",
        }).then(async (res) => {

            if (res.isConfirmed) {

                await deleteSuccessCaseService(id);

                setCases(prev => prev.filter(c => c.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Caso eliminado",
                    timer: 1200,
                    showConfirmButton: false,
                });

            }

        });
    };

    /* 👉 Editar */
    const openEditCase = (c: any) => {

        setEditingCase(c);

        setForm({
            title: c.title,
            description: c.description,
            imageUrl: c.imageUrl,
            area: c.area,
            order: c.order
        });

        setIsModalOpen(true);
    };

    const isFormValid =
        form.title.trim() &&
        form.description.trim() &&
        form.imageUrl.trim();

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        Casos de éxito
                    </h1>
                    <p className="text-gray-600">
                        Administración de casos de éxito del despacho
                    </p>
                    <p className="text-gray-600">
                        (*) Solo se recomiendan 3 caso como máximo.
                    </p>
                </div>

                <button
                    disabled={cases.length >= 3}
                    onClick={() => {
                        setEditingCase(null);
                        setForm({
                            title: "",
                            description: "",
                            imageUrl: "",
                            area: "",
                            order: 1
                        });
                        setIsModalOpen(true);
                    }}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
                        ${cases.length >= 3
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"}
                    `}
                >
                    <HiOutlinePlus />
                    Nuevo caso
                </button>
            </div>

            {/* TABLA */}

            {loadingCases ? (
                <div className="py-10 text-center text-gray-500">
                    Cargando casos...
                </div>
            ) : cases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="text-5xl mb-3">🏆</div>
                    <p className="font-semibold text-lg">
                        No hay casos registrados
                    </p>
                    <p className="text-sm">
                        Cuando agregues uno aparecerá aquí.
                    </p>
                </div>
            ) : (

                <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-primary text-white uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Imagen</th>
                                <th className="px-6 py-4 text-left">Título</th>
                                <th className="px-6 py-4 text-left">Orden</th>
                                <th className="px-6 py-4 text-left">Area</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cases.map((c, index) => (

                                <tr
                                    key={c.id}
                                    className={`
                  border-t transition
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                  hover:bg-primary/5
                `}
                                >

                                    <td className="px-6 py-4">

                                        {c.imageUrl ? (
                                            <img
                                                src={c.imageUrl}
                                                alt={c.title}
                                                className="w-14 h-14 object-cover rounded-lg border"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                Sin imagen
                                            </div>
                                        )}

                                    </td>

                                    <td className="px-6 py-4 font-semibold text-primary">
                                        {c.title}
                                    </td>

                                    <td className="px-6 py-4">
                                        {c.order}
                                    </td>

                                    <td className="px-6 py-4">
                                        {c.area}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        <div className="flex justify-end gap-3">

                                            <button
                                                className="text-primary hover:text-secondary"
                                                onClick={() => openEditCase(c)}
                                            >
                                                <HiOutlinePencil size={22} />
                                            </button>

                                            <button
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleDelete(c.id)}
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

            )}

            {/* MODAL */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[90vh]">

                        <div className="px-6 py-4 border-b">

                            <h2 className="text-lg font-bold text-primary">
                                {editingCase ? "Editar caso" : "Nuevo caso"}
                            </h2>

                        </div>

                        <div className="px-6 py-6 space-y-5 overflow-y-auto">

                            <label className="block text-sm font-medium">
                                Título *
                            </label>

                            <input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

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

                            <label className="block text-sm font-medium">
                                Descripción *
                            </label>

                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <label className="block text-sm font-medium">
                                URL Imagen *
                            </label>

                            <input
                                value={form.imageUrl}
                                onChange={(e) =>
                                    setForm({ ...form, imageUrl: e.target.value })
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <label className="block text-sm font-medium">
                                Orden
                            </label>

                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) =>
                                    setForm({ ...form, order: Number(e.target.value) })
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />
                            <label className="text-sm font-semibold text-gray-700">
                                (*) Los campos son obligatorios.
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t">

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleSaveCase}
                                disabled={!isFormValid}
                                className={`
                                    px-6 py-2 rounded-lg font-semibold transition
                                    ${isFormValid
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }
                                    `}
                            >
                                {editingCase ? "Editar caso" : "Crear caso"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessCases;