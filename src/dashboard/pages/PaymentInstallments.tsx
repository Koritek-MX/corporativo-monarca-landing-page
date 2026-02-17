import { useEffect, useState } from "react";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getPaymentsService } from "../../services/payment.service";
import {
  createInstallmentService,
  deleteInstallmentService,
  getInstallmentsByPaymentService,
  updateInstallmentService
} from "../../services/paymentInstallments.service";

const PAYMENT_METHOD_BADGE: Record<string, string> = {
  EFECTIVO: "bg-green-100 text-green-700",
  TRANSFERENCIA: "bg-blue-100 text-blue-700",
  TARJETA: "bg-purple-100 text-purple-700",
  DEPOSITO: "bg-yellow-100 text-yellow-800",
};

const PaymentInstallments = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [editingInstallment, setEditingInstallment] = useState<any>(null);
  const [installments, setInstallments] = useState<any[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    notes: "",
    method: "EFECTIVO"
  });

  useEffect(() => {
    if (!paymentId) return;
    loadInstallments();
    loadPaymentInfo();
  }, [paymentId]);

  /* 👉 Cargar abonos */
  const loadInstallments = async () => {
    try {
      setLoading(true);

      Swal.fire({
        title: "Cargando abonos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getInstallmentsByPaymentService(Number(paymentId)),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setInstallments(data);

    } catch {
      Swal.fire("Error", "No se pudieron cargar los abonos", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  /* 👉 Info del cobro */
  const loadPaymentInfo = async () => {
    try {
      const payments = await getPaymentsService();
      const found = payments.find((p: any) => p.id === Number(paymentId));
      setPaymentInfo(found);
    } catch (error) {
      console.error(error);
    }
  };

  /* 👉 Crear abono */
  const saveInstallment = async () => {
    if (!form.amount) {
      return Swal.fire("Error", "Monto requerido", "warning");
    }

    try {
      if (editingInstallment) {
        await updateInstallmentService(editingInstallment.id, {
          amount: Number(form.amount),
          notes: form.notes,
          method: form.method,
        });

        await Swal.fire({
          icon: "success",
          title: "Abono actualizado",
          timer: 1400,
          showConfirmButton: false,
        });

      } else {
        await createInstallmentService({
          paymentId: Number(paymentId),
          amount: Number(form.amount),
          notes: form.notes,
          method: form.method,
        });

        await Swal.fire({
          icon: "success",
          title: "Abono registrado",
          timer: 1400,
          showConfirmButton: false,
        });
      }

      setEditingInstallment(null);
      setForm({ amount: "", notes: "", method: "" });
      setIsModalOpen(false);
      loadInstallments();

    } catch {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  /* 👉 Eliminar abono */
  const deleteInstallment = (id: number) => {
    Swal.fire({
      title: "¿Eliminar abono?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await deleteInstallmentService(id);

        setInstallments((prev) =>
          prev.filter((i) => i.id !== id)
        );

        await Swal.fire({
          icon: "success",
          title: "Abono eliminado",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  const openEditInstallment = (installment: any) => {
    setEditingInstallment(installment);
    setForm({
      amount: String(installment.amount),
      notes: installment.notes || "",
      method: installment.method || "",
    });
    setIsModalOpen(true);
  };

  const totalPaid = installments.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  const totalPayment = Number(paymentInfo?.finalAmount || 0);
  const balance = totalPayment - totalPaid;

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Abonos del cobro - #{paymentId}
          </h2>

          <p className="text-gray-600">
            {paymentInfo
              ? `${paymentInfo.client?.name} ${paymentInfo.client?.lastName} · "${paymentInfo.case?.folio} - ${paymentInfo.case?.title}`
              : ""}
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
            disabled={balance <= 0}
            onClick={() => setIsModalOpen(true)}
            className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition
            ${balance <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"}
          `}
          >
            <HiOutlinePlus />
            Nuevo abono
          </button>
        </div>
      </div>

      {paymentInfo && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Total factura</p>
            <p className="text-lg font-bold text-primary">
              ${totalPayment.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Total abonado</p>
            <p className="text-lg font-bold text-green-700">
              ${totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Saldo pendiente</p>
            <p className="text-lg font-bold text-red-600">
              ${balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}
      {/* TABLA */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Cargando abonos...
        </div>
      ) : installments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-500">
          <div className="text-5xl mb-3">💰</div>
          <p className="font-semibold text-lg">
            No hay abonos registrados
          </p>
          <p className="text-sm">
            Cuando registres uno aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Monto</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Método</th>
                <th className="px-6 py-4 text-left">Notas</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {installments.map((i, index) => (
                <tr
                  key={i.id}
                  className={`
                    border-t transition
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                    hover:bg-primary/5
                  `}
                >
                  <td className="px-6 py-4 font-semibold text-green-700">
                    ${Number(i.amount).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(i.createdAt).toLocaleDateString("es-MX")}
                  </td>

                  <td className="px-6 py-4">
                    {i.method ? (
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase
                        ${PAYMENT_METHOD_BADGE[i.method] || "bg-gray-100 text-gray-600"}`}
                      >
                        {i.method}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {i.notes || "—"}
                  </td>

                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => openEditInstallment(i)}
                      className="text-primary hover:text-secondary"
                    >
                      <HiOutlinePencil size={20} />
                    </button>

                    <button
                      onClick={() => deleteInstallment(i.id)}
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
      )}

      {/* MODAL CREAR ABONO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                {editingInstallment ? "Editar abono" : "Registrar abono"}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              <label className="block text-sm font-medium mb-1">Monto</label>
              <input
                placeholder="1,000"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block text-sm font-medium mb-1">Método de pago</label>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({ ...form, method: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="DEPOSITO">Depósito</option>
              </select>

              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                placeholder="Número de transferencia: XXXXXXXX"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={saveInstallment}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-white"
              >
                Guardar abono
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInstallments;