import { useState } from "react";
import {
    HiOutlineTrash,
    HiOutlineEye,
} from "react-icons/hi";
import { formatPhone } from "../../components/common/formatPhone";
import Swal from "sweetalert2";

/* 📩 Mock contactos */
const MOCK_CONTACTS = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan@email.com",
        phone: "3525616329",
        message: "Necesito asesoría laboral. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        date: "2026-02-03",
        status: "nuevo",
        city: "La Piedad, Michoacán",
    },
    {
        id: 2,
        name: "Empresa XYZ",
        email: "contacto@xyz.com",
        phone: "5551234567",
        message: "Revisión contrato mercantil.",
        date: "2026-02-01",
        status: "contactado",
        city: "Arandas, Jalisco",
    },
];

const Contacts = () => {
    const [contacts, setContacts] = useState(MOCK_CONTACTS);
    const [selected, setSelected] = useState<any>(null);

    const deleteContact = (id: number) => {
        Swal.fire({
            title: "¿Eliminar contacto?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                setContacts(contacts.filter((c) => c.id !== id));
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-primary">
                    Contactos
                </h1>
                <p className="text-gray-600">
                    Personas que han solicitado información desde la landing page
                </p>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-primary text-white uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Nombre</th>
                            <th className="px-6 py-4 text-left">Correo</th>
                            <th className="px-6 py-4 text-left">Teléfono</th>
                            <th className="px-6 py-4 text-left">Fecha</th>
                            <th className="px-6 py-4 text-left">Ciudad / Pueblo</th>
                            <th className="px-6 py-4 text-left">Mensaje</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contacts.map((c, index) => (
                            <tr
                                key={c.id}
                                className={`
                                    border-t transition
                                    ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                                    hover:bg-primary/5
                                `}
                            >
                                <td className="px-6 py-4 font-semibold text-primary">
                                    {c.name}
                                </td>

                                <td className="px-6 py-4">{c.email}</td>
                                <td className="px-6 py-4">{formatPhone(c.phone)}</td>
                                <td className="px-6 py-4">{c.date}</td>


                                <td className="px-6 py-4">{c.city}</td>
                                <td className="px-6 py-4 max-w-xs truncate">
                                    {c.message}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">

                                        <button
                                            onClick={() => setSelected(c)}
                                            className="text-primary hover:text-secondary"
                                        >
                                            <HiOutlineEye size={22} />
                                        </button>

                                        <button
                                            onClick={() => deleteContact(c.id)}
                                            className="text-red-500 hover:text-red-600"
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

            {/* Modal detalle */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

                        <div className="px-6 py-4 border-b">
                            <h2 className="font-bold text-primary">
                                Detalle del contacto
                            </h2>
                        </div>

                        <div className="px-6 py-6 space-y-4 text-sm">

                            <p>
                                <b>Nombre:</b> {selected.name}
                            </p>

                            <p>
                                <b>Email:</b> {selected.email}
                            </p>

                            <p>
                                <b>Teléfono:</b> {formatPhone(selected.phone)}
                            </p>

                            <p>
                                <b>Fecha:</b> {selected.date}
                            </p>

                            <div>
                                <b>Mensaje:</b>
                                <p className="bg-gray-50 p-3 rounded-lg mt-2">
                                    {selected.message}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end px-6 py-4 border-t">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;