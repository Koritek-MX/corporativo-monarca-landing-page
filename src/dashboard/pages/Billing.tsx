import { createInstallmentService } from "../../services/paymentInstallments.service";
import { getCasesByClientIdService } from "../../services/case.services";
import { getClientsService } from "../../services/client.service";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import html2canvas from "html2canvas";
import {
  deletePaymentsService,
  getPaymentsService,
  createPaymentsService,
  updatePaymentsService
} from "../../services/payment.service";
import Swal from "sweetalert2";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import jsPDF from "jspdf";

/* 🎨 Estilos por estatus */
const PAYMENT_STATUS: Record<string, { bg: string; text: string }> = {

  pendiente: { bg: "bg-yellow-100", text: "text-yellow-800" },
  pagado: { bg: "bg-green-100", text: "text-green-700" },
  vencido: { bg: "bg-red-100", text: "text-red-700" },
  cancelado: { bg: "bg-gray-100", text: "text-gray-600" },
};


const Billing = () => {

  const navigate = useNavigate();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeIva, setIncludeIva] = useState(true);
  const [payments, setPayments] = useState<any>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [loadingPayments, setLoadingPayments] = useState(false);
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
      setLoadingPayments(true);
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
      await Swal.fire("Error", "No se pudieron cargar los cobros", "error");
    } finally {
      setLoadingPayments(false);
      Swal.close();
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClientsService();
      setClients(data);
    } catch (error) {
      console.error("Error: No se pudieron cargar los clientes");
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

  const total = Number(form.totalAmount || 0);
  const initial = Number(form.initialPaid || 0);
  const iva = Number(form.iva || 0);

  const isPaymentValid =
    form.clientId &&
    form.clientId !== "0" &&
    form.caseId &&
    form.currency &&
    form.status &&
    total > 0 &&
    initial >= 0 &&
    initial <= total &&
    (!includeIva || iva >= 0);

  const openReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setReceiptOpen(true);
  };

  const generatePDF = async (payment: any) => {

    const fileName = `Comprobante-${payment.case?.folio}.pdf`;
    const element = document.getElementById("receipt");

    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  };

  const sendWhatsApp = (payment: any) => {
    console.log(payment.client);
    let phone = payment.client?.phone || "";

    // 👉 limpiar todo menos números
    phone = phone.replace(/\D/g, "");

    // 👉 agregar lada México si no la tiene
    if (!phone.startsWith("52")) {
      phone = "52" + phone;
    }

    if (!phone) {
      Swal.fire("Error", "El cliente no tiene teléfono", "warning");
      return;
    }

    const message = encodeURIComponent(
      `Hola ${payment.client?.name}, te enviamos tu comprobante de pago del asunto ${payment.case?.title}.`
    );

    const url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank");
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

      {loadingPayments ? (
        <div className="py-10 text-center text-gray-500">
          Cargando cobros...
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">💵</div>
          <p className="font-semibold text-lg">
            No hay cobros registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      ) : (
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
                <th className="px-6 py-4 text-center">Comprobante</th>
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

                    {/* Botón comprobante */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openReceipt(c)}
                        className="text-primary hover:text-secondary transition"
                      >
                        <LiaFileInvoiceDollarSolid size={25} />
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
      )}

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

              <button
                onClick={savePayment}
                disabled={!isPaymentValid}
                className={`
                px-6 py-2 rounded-lg font-semibold transition
                ${isPaymentValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
              `}
              >
                {editingPayment ? "Editar cobro" : "Crear cobro"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL COMPROBANTE */}
      {receiptOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">

            {/* HEADER (FIJO) */}
            <div className="px-6 py-4 border-b flex justify-between items-center shrink-0">
              <h2 className="font-bold text-primary">
                Comprobante de pago
              </h2>

              <button
                onClick={() => setReceiptOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="overflow-y-auto px-6 py-6 flex-1">
              <div
                id="receipt"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  fontFamily: "Arial, sans-serif",
                  padding: "40px",
                  maxWidth: "800px",
                  margin: "auto"
                }}
              >
                {/* HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "3px solid #1A3263",
                    paddingBottom: "20px",
                    marginBottom: "30px"
                  }}
                >
                  <div>
                    <img
                      src="/monarca-blue.png"
                      alt="Corporativo Monarca"
                      style={{ height: "100px", marginBottom: "8px" }}
                    />

                    <p style={{ fontSize: "12px", margin: 0 }}>
                      Corporativo Monarca - Consultoria jurídica y empresarial
                    </p>
                     <p style={{ fontSize: "12px", margin: 0 }}>
                      RFC: MON123456ABC
                    </p>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      Juan Escutia #10 Int. 3, Col. Centro, CP. 59300
                    </p>

                    <p style={{ fontSize: "12px", margin: 0 }}>
                      La Piedad de Cabadas, Michoacán, México
                    </p>

                     <p style={{ fontSize: "12px", margin: 0 }}>
                      monarcacorporativo@outlook.com
                    </p>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      Tel: 352-501-5754
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ marginBottom: 20, color: "#1A3263" }}>
                      COMPROBANTE DE PAGO
                    </h2>

                    <p style={{ fontSize: "12px", margin: 0 }}>
                      Folio: #{selectedPayment.id}
                    </p>

                    <p style={{ fontSize: "12px", margin: 0 }}>
                      Fecha:
                      {new Date(
                        selectedPayment.createdAt
                      ).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                </div>

                {/* CLIENTE */}
                <div style={{ marginBottom: "25px" }}>
                  <h3 style={{ marginBottom: "8px", color: "#1A3263" }}>
                    Datos del cliente
                  </h3>

                  <p>
                    <strong>Cliente:</strong>{" "}
                    {selectedPayment.client?.name}{" "}
                    {selectedPayment.client?.lastName}
                  </p>

                  <p>
                    <strong>Asunto:</strong>{" "}
                    {selectedPayment.case?.folio} -
                    {selectedPayment.case?.title}
                  </p>

                   <p>
                    <strong>Responsable:</strong>{" "}
                    {selectedPayment.case?.lawyer.name}
                  </p>

                  <p>
                    <strong>Estado:</strong>{" "}
                    {selectedPayment.status}
                  </p>
                </div>

                {/* RESUMEN FINANCIERO */}
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "25px"
                  }}
                >
                  <h3 style={{ marginBottom: "15px", color: "#1A3263" }}>
                    Resumen financiero
                  </h3>

                  <p>
                    Subtotal: $
                    {Number(selectedPayment.totalAmount).toLocaleString()} MXN
                  </p>

                  <p>
                    IVA ({selectedPayment.iva || 0}%): $
                    {(
                      (Number(selectedPayment.totalAmount) *
                        Number(selectedPayment.iva || 0)) /
                      100
                    ).toLocaleString()} MXN
                  </p>

                  <p style={{ fontWeight: "bold" }}>
                    Total: $
                    {Number(selectedPayment.finalAmount).toLocaleString()} MXN
                  </p>
                </div>

                {/* ABONOS */}
                {selectedPayment.installments?.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h3 style={{ marginBottom: "10px", color: "#1A3263" }}>
                      Historial de abonos
                    </h3>

                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "13px"
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                          <th style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                            Fecha
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                            Método
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                            Monto
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedPayment.installments.map((i: any) => (
                          <tr key={i.id}>
                            <td style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                              {new Date(i.createdAt).toLocaleDateString("es-MX")}
                            </td>

                            <td style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                              {i.method}
                            </td>

                            <td style={{ padding: "8px", border: "1px solid #e5e7eb" }}>
                              ${Number(i.amount).toLocaleString()} MXN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SALDO */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "30px"
                  }}
                >
                  Saldo pendiente: $
                  {(
                    Number(selectedPayment.finalAmount) -
                    (selectedPayment.installments || []).reduce(
                      (acc: number, i: any) => acc + Number(i.amount),
                      0
                    )
                  ).toLocaleString()} MXN
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    borderTop: "2px solid #e5e7eb",
                    paddingTop: "15px",
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#6b7280"
                  }}
                >
                  © {new Date().getFullYear()} Corporativo Monarca.
                  Todos los derechos reservados.

                  <br />

                  Este documento se emite como comprobante interno de pago y
                  no sustituye una factura fiscal.
                </div>
              </div>

            </div>

            {/* FOOTER (FIJO) */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-white">
              <button
                onClick={() => generatePDF(selectedPayment)}
                className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Descargar PDF
                <FaRegFilePdf />
              </button>

              {/* <button
                onClick={() => sendWhatsApp(selectedPayment)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Enviar WhatsApp
                <FaWhatsapp />
              </button> */}
            </div>

          </div>
        </div>
      )}


    </div>
  );
};

export default Billing;