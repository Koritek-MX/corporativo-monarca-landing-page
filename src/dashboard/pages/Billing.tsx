import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { MdAttachMoney } from "react-icons/md";

/* 🎨 Estilos por estatus */
const PAYMENT_STATUS: Record<string, { bg: string; text: string }> = {

  pendiente: { bg: "bg-yellow-100", text: "text-yellow-800" },
  pagado: { bg: "bg-green-100", text: "text-green-700" },
  vencido: { bg: "bg-red-100", text: "text-red-700" },
  cancelado: { bg: "bg-gray-100", text: "text-gray-600" },
};

/* 💰 Cobros mock */
const MOCK_COBROS = [
  {
    id: "C-001",
    client: "Juan Pérez",
    case: "Audiencia laboral",
    total: 15000,
    paid: 5000,
    status: "pendiente",
    method: "Transferencia",
    date: "2024-02-10",
  },
  {
    id: "C-002",
    client: "Empresa XYZ",
    case: "Contrato mercantil",
    total: 30000,
    paid: 30000,
    status: "pagado",
    method: "Efectivo",
    date: "2024-01-22",
  },
];

const Billing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    description: "",
    date: "",
    status: "pendiente",
    file: null as File | null,
  });

  /* 🧾 Formulario */
  const [form, setForm] = useState({
    currency: "MXN",
    total: 0,
    paid: 0,
    ivaPercent: 16,
    status: "pendiente",
    sendEmail: false,
  });

  const ivaAmount = (form.total * form.ivaPercent) / 100;
  const totalWithIva = form.total + ivaAmount;

  const openPaymentModal = (billing: any) => {
  setSelectedBilling(billing);
  setPaymentForm({
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    status: billing.status,
    file: null,
  });
  setPaymentModalOpen(true);
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
          onClick={() => setIsModalOpen(true)}
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
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {MOCK_COBROS.map((c, index) => {
              const balance = c.total - c.paid;

              return (
                <tr
                  key={c.id}
                  className={`
                    border-t transition
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    hover:bg-primary/5
                  `}
                >
                  <td className="px-6 py-4 font-semibold text-primary">
                    {c.id}
                  </td>
                  <td className="px-6 py-4">{c.client}</td>
                  <td className="px-6 py-4">{c.case}</td>
                  <td className="px-6 py-4 text-right">
                    ${c.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-green-700">
                    ${c.paid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600">
                    ${balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">{c.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex uppercase px-3 py-1 rounded-full text-xs font-semibold
                        ${PAYMENT_STATUS[c.status].bg}
                        ${PAYMENT_STATUS[c.status].text}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-700"
                        onClick={() => openPaymentModal(c)}
                      >
                        <MdAttachMoney size={25}/>
                      </button>
                      <button className="text-primary hover:text-secondary">
                        <HiOutlinePencil size={22}/>
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <HiOutlineTrash size={22}/>
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
                Registrar cobro
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Selecciona un cliente</option>
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium mb-1">Asunto</label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Selecciona un asunto</option>
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
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Selecciona un estado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="abono">Abono</option>
                </select>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Monto total
                  </label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setForm({ ...form, total: Number(e.target.value) })
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
                    onChange={(e) =>
                      setForm({ ...form, paid: Number(e.target.value) })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* IVA */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">IVA %</label>
                  <input
                    value="16"
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total IVA
                  </label>
                  <input
                    value={`${form.currency} ${ivaAmount.toFixed(2)}`}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total con IVA
                  </label>
                  <input
                    value={`${form.currency} ${totalWithIva.toFixed(2)}`}
                    disabled
                    className="w-full border rounded-lg px-4 py-3 bg-gray-100 font-semibold"
                  />
                </div>
              </div>

              {/* Adjuntar factura */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Adjuntar factura
                </label>

                {/* PDF */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Archivo PDF
                  </label>

                  <label
                    htmlFor="pdf"
                    className="
                    inline-flex items-center justify-center
                    w-full px-4 py-3
                    border border-gray-300 rounded-lg
                    cursor-pointer
                    text-sm font-medium text-primary
                    bg-primary/5
                    hover:bg-primary/10
                    transition
                  "
                  >
                    Seleccionar archivo PDF
                  </label>

                  <input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      setPdfName(e.target.files?.[0]?.name || "")
                    }
                  />

                  {pdfName && (
                    <p className="text-xs text-gray-500 mt-1">
                      Archivo seleccionado: {pdfName}
                    </p>
                  )}
                </div>

              </div>

              {/* Enviar correo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) =>
                    setForm({ ...form, sendEmail: e.target.checked })
                  }
                />
                <span className="text-sm">
                  Enviar comprobante al cliente por correo electrónico
                </span>
              </div>

            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button className="px-6 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition">
                Guardar cobro
              </button>
            </div>

          </div>
        </div>
      )}

      {paymentModalOpen && selectedBilling && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-primary">
          Registrar pago
        </h2>
        <p className="text-sm text-gray-500">
          Factura {selectedBilling.id}
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-5">

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-primary">
              ${selectedBilling.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Pagado</p>
            <p className="font-bold text-green-700">
              ${selectedBilling.paid.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Pendiente</p>
            <p className="font-bold text-red-600">
              ${(selectedBilling.total - selectedBilling.paid).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Monto a abonar
          </label>
          <input
            type="number"
            value={paymentForm.amount}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, amount: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
            placeholder="$0.00"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha y hora
          </label>
          <input
            type="datetime-local"
            value={paymentForm.date}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, date: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            rows={3}
            value={paymentForm.description}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, description: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
            placeholder="Ej. Pago parcial de honorarios"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Estado del comprobante
          </label>
          <select
            value={paymentForm.status}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, status: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="vencido">Vencido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Archivo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Comprobante (PDF / XML)
          </label>

          <label
            htmlFor="paymentFile"
            className="
              inline-flex items-center justify-center
              w-full px-4 py-3
              border border-gray-300 rounded-lg
              cursor-pointer
              text-sm font-medium text-primary
              bg-primary/5
              hover:bg-primary/10
              transition
            "
          >
            Adjuntar comprobante
          </label>

          <input
            id="paymentFile"
            type="file"
            accept=".pdf,.xml"
            className="hidden"
            onChange={(e) =>
              setPaymentForm({
                ...paymentForm,
                file: e.target.files?.[0] || null,
              })
            }
          />

          {paymentForm.file && (
            <p className="text-xs text-gray-500 mt-1">
              Archivo: {paymentForm.file.name}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <button
          onClick={() => setPaymentModalOpen(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>

        <button
          className="px-6 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition"
        >
          Registrar pago
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Billing;