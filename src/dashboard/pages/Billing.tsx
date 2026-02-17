import { createInstallmentService } from "../../services/paymentInstallments.service";
import { getCasesByClientIdService } from "../../services/case.services";
import { getClientsService } from "../../services/client.service";
import { useNavigate } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";
import {
  deletePaymentsService,
  getPaymentsService,
  createPaymentsService,
  updatePaymentsService
} from "../../services/payment.service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

/* 🎨 Estilos por estatus */
const PAYMENT_STATUS: Record<string, { bg: string; text: string }> = {

  pendiente: { bg: "bg-yellow-100", text: "text-yellow-800" },
  pagado: { bg: "bg-green-100", text: "text-green-700" },
  vencido: { bg: "bg-red-100", text: "text-red-700" },
  cancelado: { bg: "bg-gray-100", text: "text-gray-600" },
};


const Billing = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeIva, setIncludeIva] = useState(true);
  const [payments, setPayments] = useState<any>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const navigate = useNavigate();
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [form, setForm] = useState({
    currency: "MXN",
    totalAmount: "",
    finalAmount: "",
    initialPaid: "",
    iva: 16,
    status: "pendiente",
    sendEmail: false,
    clientId: "",
    caseId: "",
    invoiceUrl: "",
  });

  useEffect(() => {
    loadPayments();
    loadClients();
  }, []);

  const loadPayments = async () => {
    try {
      Swal.fire({
        title: "Cargando cobros...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const [data] = await Promise.all([
        getPaymentsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      console.log(data)
      setPayments(data);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los cobros", "error");
    } finally {
      Swal.close();
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClientsService();
      setClients(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
  };

  const loadCases = async (clientId: number) => {
    try {
      Swal.fire({
        title: "Cargando asuntos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const start = Date.now();

      const data = await getCasesByClientIdService(clientId);
      setCases(data);

      // 👇 Garantiza mínimo 700ms de loader
      const elapsed = Date.now() - start;
      if (elapsed < 700) {
        await new Promise((resolve) =>
          setTimeout(resolve, 700 - elapsed)
        );
      }

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los asuntos", "error");
    } finally {
      Swal.close();
    }
  };

  const savePayment = async () => {
    try {
      if (!form.clientId || !form.caseId || !form.totalAmount) {
        return Swal.fire("Error", "Completa los campos", "warning");
      }

      // 👉 Normalización de valores
      const totalAmount = Number(form.totalAmount || 0);
      const initialPaid = Number(form.initialPaid || 0);
      const iva = includeIva ? Number(form.iva || 0) : 0;

      // 👉 Cálculo automático final
      const finalAmount = totalAmount + (totalAmount * iva) / 100;

      const payload = {
        clientId: Number(form.clientId),
        caseId: Number(form.caseId),
        currency: form.currency,
        status: form.status,
        totalAmount,
        initialPaid,
        iva,
        finalAmount,
        invoiceUrl: form.invoiceUrl || "",
      };

      if (editingPayment) {
        await updatePaymentsService(editingPayment.id, payload);

        await Swal.fire({
          icon: "success",
          title: "Cobro actualizado",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {
        // 👉 Crear cobro
        const paymentCreated = await createPaymentsService(payload);

        // 👉 Si hay abono inicial crear installment automático
        if (initialPaid > 0) {
          await createInstallmentService({
            paymentId: paymentCreated.id,
            amount: initialPaid,
            notes: "Abono inicial automático",
            method: "EFECTIVO",
          });
        }

        await Swal.fire({
          icon: "success",
          title: "Cobro creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // 👉 Reset limpio
      setEditingPayment(null);
      setIsModalOpen(false);

      setForm({
        currency: "MXN",
        totalAmount: "",
        finalAmount: "",
        initialPaid: "",
        iva: 16,
        status: "PENDIENTE",
        sendEmail: false,
        clientId: "",
        caseId: "",
        invoiceUrl: "",
      });

      setIncludeIva(true);

      await loadPayments();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  const openEditPayment = async (payment: any) => {

    if (payment.iva == 0) setIncludeIva(false);

    setEditingPayment(payment);

    // 👇 cargar asuntos del cliente antes de abrir modal
    if (payment.clientId) {
      await loadCases(Number(payment.clientId));
    }

    setForm({
      currency: payment.currency || "MXN",
      totalAmount: payment.totalAmount || 0,
      finalAmount: payment.finalAmount || 0,
      initialPaid: payment.initialPaid || 0,
      iva: payment.iva || 16,
      status: payment.status || "PENDIENTE",
      sendEmail: false,

      // 👇 selects trabajan mejor como string
      clientId: String(payment.clientId || ""),
      caseId: String(payment.caseId || ""),
      invoiceUrl: payment.invoiceUrl || "",
    });

    setIsModalOpen(true);
  };


  /* 👉 Eliminar */
  const deletePayment = (id: number) => {
    Swal.fire({
      title: "¿Eliminar cobro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePaymentsService(id);

          await Swal.fire({
            icon: "success",
            title: "Cobro eliminado",
            showConfirmButton: false,
            timer: 1500,
          });

          await loadPayments();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el cobro",
          });
        }
      }
    });
  };

  const newPayment = () => {
    setEditingPayment(null);
    setCases([]); // limpia asuntos
    setForm({
      currency: "MXN",
      totalAmount: "",
      finalAmount: "",
      iva: 16,
      status: "PENDIENTE",
      sendEmail: false,
      initialPaid: "",
      clientId: "",
      caseId: "",
      invoiceUrl: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cobros</h1>
          <p className="text-gray-600">
            Control de facturación, pagos y abonos
          </p>
        </div>

        <button
          onClick={newPayment}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo cobro
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Folio</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Asunto</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-right">Pagado</th>
              <th className="px-6 py-4 text-right">Saldo</th>
              <th className="px-6 py-4 text-right">Fecha</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-center">Abonos</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((c: any, index: number) => {

              // 👉 Sumar todos los abonos del cobro
              const paid = (c.installments || []).reduce(
                (acc: number, i: any) => acc + Number(i.amount || 0),
                0
              );

              // 👉 Total del cobro (incluye IVA)
              const total = Number(c.finalAmount || 0);

              // 👉 Saldo pendiente
              const balance = total - paid;

              return (
                <tr
                  key={c.id}
                  className={`
                    border-t transition
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                    hover:bg-primary/5
                  `}
                >
                  {/* Folio */}
                  <td className="px-6 py-4 font-semibold text-primary">
                    #{c.id}
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    {c.client?.name + " " + c.client?.lastName || "-"}
                  </td>

                  {/* Caso */}
                  <td className="px-6 py-4">
                    {c.case?.folio + " - " + c.case?.title || "-"}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-right">
                    <strong> ${total.toLocaleString()} </strong>
                  </td>

                  {/* Pagado */}
                  <td className="px-6 py-4 text-right text-green-700">
                    ${paid.toLocaleString()}
                  </td>

                  {/* Saldo */}
                  <td className="px-6 py-4 text-right font-semibold text-red-600">
                    ${balance.toLocaleString()}
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-right">
                    {new Date(c.createdAt).toLocaleDateString("es-MX")}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex uppercase px-3 py-1 rounded-full text-xs font-semibold
                        ${PAYMENT_STATUS[c.status.toLowerCase()]?.bg}
                        ${PAYMENT_STATUS[c.status.toLowerCase()]?.text}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Botón abono */}
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-green-600 hover:text-green-700"
                      onClick={() => navigate(`/dashboard/cobros/${c.id}/abonos`)}
                    >
                      <MdAttachMoney size={25} />
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button className="text-primary hover:text-secondary"
                        onClick={() => openEditPayment(c)}>
                        <HiOutlinePencil size={22} />
                      </button>
                      <button className="text-red-500 hover:text-red-600"
                        onClick={() => deletePayment(c.id)}
                      >
                        <HiOutlineTrash size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL – Nuevo Cobro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                {editingPayment ? "Editar cobro" : "Registrar cobro"}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  value={form.clientId}
                  onChange={async (e) => {
                    const id = e.target.value;

                    setForm({
                      ...form,
                      clientId: id,
                      caseId: "",
                    });

                    if (!id) return;

                    // 👉 Mostrar loader SIN await
                    Swal.fire({
                      title: "Cargando asuntos...",
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    try {
                      await loadCases(Number(id));
                    } finally {
                      Swal.close();
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="0">Selecciona cliente</option>

                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium mb-1">Asunto</label>
                <select
                  value={form.caseId}
                  onChange={(e) =>
                    setForm({ ...form, caseId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona un asunto</option>

                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.folio} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Moneda */}
              <div>
                <label className="block text-sm font-medium mb-1">Moneda</label>
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                >
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </select>
              </div>


              {/* Estado de la factura */}
              <div>
                <label className="block text-sm font-medium mb-1">Estado del folio</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="PAGADO">Pagado</option>
                </select>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Monto total
                  </label>
                  <input

                    value={form.totalAmount}
                    onChange={(e) =>
                      setForm({ ...form, totalAmount: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Abono inicial
                  </label>
                  <input
                    type="number"
                    value={form.initialPaid}
                    onChange={(e) =>
                      setForm({ ...form, initialPaid: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              {/* Checkbox IVA */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeIva}
                  onChange={(e) => {
                    setIncludeIva(e.target.checked);

                    // 👉 si quita IVA se pone en 0
                    if (!e.target.checked) {
                      setForm({ ...form, iva: 0 });
                    } else {
                      setForm({ ...form, iva: 16 });
                    }
                  }}
                />
                <span className="text-sm font-medium">
                  Agregar IVA
                </span>
              </div>


              {/* IVA */}


              {includeIva && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">IVA %</label>
                    <input
                      type="number"
                      value={form.iva}
                      onChange={(e) =>
                        setForm({ ...form, iva: Number(e.target.value) })
                      }
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                      placeholder="IVA %"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total IVA
                    </label>
                    <input
                      value={`${form.currency} ${((Number(form.totalAmount) * Number(form.iva)) / 100).toFixed(2)}`}
                      disabled
                      className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Monto total con IVA
                    </label>
                    <input
                      value={`${form.currency} ${(Number(form.totalAmount) + ((Number(form.totalAmount) * Number(form.iva)) / 100)).toFixed(2)}`}
                      disabled
                      className="w-full border rounded-lg px-4 py-3 bg-gray-100 font-semibold"
                    />
                  </div>
                </div>
              )}



            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button className="px-6 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition"
                onClick={savePayment}>
                Guardar cobro
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;