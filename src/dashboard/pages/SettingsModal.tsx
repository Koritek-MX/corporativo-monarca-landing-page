import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: Props) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailReports: true,
    language: "es",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-primary">
            Configuración
          </h2>

          <button onClick={onClose}>
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-6">

          {/* Notificaciones */}
          <label className="flex items-center justify-between">
            <span className="text-gray-700">
              Notificaciones del sistema
            </span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: e.target.checked,
                })
              }
              className="w-5 h-5 accent-primary"
            />
          </label>

          {/* Modo oscuro */}
          <label className="flex items-center justify-between">
            <span className="text-gray-700">
              Modo oscuro
            </span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  darkMode: e.target.checked,
                })
              }
              className="w-5 h-5 accent-primary"
            />
          </label>

          {/* Reportes email */}
          <label className="flex items-center justify-between">
            <span className="text-gray-700">
              Reportes automáticos por correo
            </span>
            <input
              type="checkbox"
              checked={settings.emailReports}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emailReports: e.target.checked,
                })
              }
              className="w-5 h-5 accent-primary"
            />
          </label>

          {/* Idioma */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Idioma
            </label>

            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  language: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancelar
          </button>

          <button
            className="
              bg-primary text-white
              px-6 py-2 rounded-lg font-semibold
              hover:bg-primary/90 transition
            "
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;