import { useEffect, useState } from "react";
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
} from "react-icons/hi";
import Swal from "sweetalert2";

import {
    getAllFaqsService,
    createFaqService,
    updateFaqService,
    deleteFaqService,
} from "../../services/faq.service";

const FAQDashboard = () => {

    const [faqs, setFaqs] = useState<any[]>([]);
    const [loadingFaqs, setLoadingFaqs] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any>(null);
    const [form, setForm] = useState({
        question: "",
        answer: "",
        order: 0
    });

    /* 👉 Cargar FAQs */
    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            setLoadingFaqs(true);

            Swal.fire({
                title: "Cargando preguntas...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const [data] = await Promise.all([
                getAllFaqsService(),
                new Promise((resolve) => setTimeout(resolve, 700)),
            ]);

            setFaqs(data);

        } catch {
            Swal.fire("Error", "No se pudieron cargar las preguntas", "error");
        } finally {
            setLoadingFaqs(false);
            Swal.close();
        }
    };

    /* 👉 Guardar */
    const handleSaveFaq = async () => {

        if (!form.question || !form.answer) {
            return Swal.fire("Error", "Completa los campos", "warning");
        }

        try {

            const payload = {
                question: form.question,
                answer: form.answer,
                order: Number(form.order)
            };

            if (editingFaq) {

                await updateFaqService(editingFaq.id, payload);

                await Swal.fire({
                    icon: "success",
                    title: "Pregunta actualizada",
                    timer: 1400,
                    showConfirmButton: false,
                });

            } else {

                await createFaqService(payload);

                await Swal.fire({
                    icon: "success",
                    title: "Pregunta creada",
                    timer: 1400,
                    showConfirmButton: false,
                });

            }

            setIsModalOpen(false);
            setEditingFaq(null);

            setForm({
                question: "",
                answer: "",
                order: 0
            });

            loadFaqs();

        } catch {
            Swal.fire("Error", "No se pudo guardar", "error");
        }
    };

    /* 👉 Eliminar */
    const handleDelete = (id: number) => {

        Swal.fire({
            title: "¿Eliminar pregunta?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#dc2626",
        }).then(async (res) => {

            if (res.isConfirmed) {

                await deleteFaqService(id);

                setFaqs(prev => prev.filter(f => f.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Pregunta eliminada",
                    timer: 1200,
                    showConfirmButton: false,
                });

            }

        });
    };

    /* 👉 Editar */
    const openEditFaq = (faq: any) => {

        setEditingFaq(faq);

        setForm({
            question: faq.question,
            answer: faq.answer,
            order: faq.order
        });

        setIsModalOpen(true);
    };

    const isFormValid =
        form.question.trim() &&
        form.answer.trim();

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        Preguntas frecuentes
                    </h1>
                    <p className="text-gray-600">
                        Administración de preguntas frecuentes del sitio
                    </p>
                    <p className="text-gray-600">
                        (*) Solo se recomiendan 10 preguntas como máximo.
                    </p>
                </div>

                <button
                    disabled={faqs.length >= 10}
                    title={faqs.length >= 6 ? "Solo se permiten 6 preguntas frecuentes" : ""}
                    onClick={() => {
                        setEditingFaq(null);
                        setForm({
                            question: "",
                            answer: "",
                            order: 0
                        });
                        setIsModalOpen(true);
                    }}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
                        ${faqs.length >= 10
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"}
                    `}
                >
                    <HiOutlinePlus />
                    Nueva pregunta
                </button>
            </div>

            {/* TABLA */}

            {loadingFaqs ? (
                <div className="py-10 text-center text-gray-500">
                    Cargando preguntas...
                </div>
            ) : faqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="text-5xl mb-3">❓</div>
                    <p className="font-semibold text-lg">
                        No hay preguntas registradas
                    </p>
                    <p className="text-sm">
                        Cuando agregues una aparecerá aquí.
                    </p>
                </div>
            ) : (

                <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-primary text-white uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 text-left">Pregunta</th>
                                <th className="px-6 py-4 text-left">Respuesta</th>
                                <th className="px-6 py-4 text-left">Orden</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {faqs.map((faq, index) => (

                                <tr
                                    key={faq.id}
                                    className={`
                                        border-t transition
                                        ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                                        hover:bg-primary/5
                                        `}
                                >

                                    <td className="px-6 py-4 font-semibold text-primary">
                                        {faq.question}
                                    </td>

                                    <td className="px-6 py-4 truncate">
                                        {faq.answer}
                                    </td>

                                    <td className="px-6 py-4">
                                        {faq.order}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        <div className="flex justify-end gap-3">

                                            <button
                                                className="text-primary hover:text-secondary"
                                                onClick={() => openEditFaq(faq)}
                                            >
                                                <HiOutlinePencil size={22} />
                                            </button>

                                            <button
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleDelete(faq.id)}
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
                                {editingFaq ? "Editar pregunta" : "Nueva pregunta"}
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-5 overflow-y-auto">
                            <label className="block text-sm font-medium">
                                Pregunta *
                            </label>
                            <input
                                value={form.question}
                                onChange={(e) =>
                                    setForm({ ...form, question: e.target.value })
                                }
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <label className="block text-sm font-medium">
                                Respuesta *
                            </label>

                            <textarea
                                rows={5}
                                value={form.answer}
                                onChange={(e) =>
                                    setForm({ ...form, answer: e.target.value })
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
                                onClick={handleSaveFaq}
                                disabled={!isFormValid}
                                className={`
                                    px-6 py-2 rounded-lg font-semibold transition
                                    ${isFormValid
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }
                                    `}
                            >
                                {editingFaq ? "Editar pregunta" : "Crear pregunta"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FAQDashboard;