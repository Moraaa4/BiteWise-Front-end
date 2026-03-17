"use client";

import React, { useState } from "react";
import { X, Info, Shield, AlertTriangle, Clock, Users, FileText } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
  error?: string;
  loading?: boolean;
}

export default function TermsModal({ isOpen, onAccept, onClose, error, loading }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Términos y Condiciones de Uso
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
                Aplicación Web de Control de Ingredientes BiteWise - Proyecto Académico UPC Chiapas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[75vh]">
          {/* Academic Nature Warning */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-bold mb-1">Proyecto Académico</p>
                <p>Esta aplicación es un proyecto académico desarrollado por estudiantes de la Universidad Politécnica de Chiapas como parte del curso Proyecto Integrador II. No es un servicio comercial ni herramienta para uso profesional.</p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                1. Aceptación de Términos
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Al acceder o utilizar esta aplicación web (en adelante "la Aplicación"), usted acepta estar sujeto a estos Términos y Condiciones de Uso ("Términos"). Si no está de acuerdo con estos Términos, le pedimos que NO utilice la Aplicación.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-500" />
                2. Naturaleza Académica del Proyecto
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>Esta Aplicación es un proyecto académico desarrollado por estudiantes de la Universidad Politécnica de Chiapas como parte del curso Proyecto Integrador II de la carrera Ingeniería en Tecnologías de la Información e Innovación Digital.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Único propósito:</strong> Demostración de competencias técnicas en desarrollo web, bases de datos y gestión de proyectos.</li>
                  <li><strong>NO es:</strong> Un servicio comercial, plataforma de producción ni herramienta para uso profesional.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                3. Restricciones de Edad y Responsabilidad
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>La Aplicación NO está diseñada ni autorizada para menores de 18 años.</li>
                  <li>Los desarrolladores NO asumimos responsabilidad alguna por el uso de la Aplicación por menores de edad.</li>
                  <li>Los padres o tutores legales son únicamente responsables de supervisar el acceso y uso por parte de menores.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">4. Funcionalidades de la Aplicación</h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>La Aplicación permite:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Registro básico de usuarios (nombre, correo electrónico).</li>
                  <li>Gestión de ingredientes (registro, consulta, edición).</li>
                  <li>Visualización de inventario y lista de compras.</li>
                </ul>
                <p>NO incluye: Procesamiento de pagos, almacenamiento de datos sensibles, funciones críticas para operaciones comerciales.</p>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                5. Limitación de Responsabilidad
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-bold">LOS DESARROLLADORES NO SE HACEN RESPONSABLES DE:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Pérdida, corrupción o mal uso de datos ingresados.</li>
                  <li>Interrupciones del servicio.</li>
                  <li>Decisiones basadas en la información mostrada en la Aplicación.</li>
                  <li>Daños indirectos, consecuentes o incidentales derivados del uso.</li>
                  <li>Cumplimiento de normativas sanitarias, de calidad alimentaria u otras regulaciones externas.</li>
                </ul>
              </div>
            </section>

            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-bold mb-2">ADVERTENCIA MÉDICA - NO SUSTITUYE PROFESIONAL</p>
                  <p className="mb-2"><strong>IMPORTANTE:</strong> La Aplicación NO está diseñada ni autorizada para personas con alergias alimentarias, restricciones dietéticas médicas o condiciones de salud especiales.</p>
                  <p className="font-bold mb-2">LOS DESARROLLADORES NO SE HACEN RESPONSABLES DE:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                    <li>Reacciones alérgicas o efectos adversos por consumir recetas o ingredientes sugeridos.</li>
                    <li>Decisiones dietéticas basadas en la información mostrada en la Aplicación.</li>
                    <li>Omisiones de advertencias sobre alérgenos comunes (gluten, lactosa, frutos secos, etc.).</li>
                  </ul>
                  <p className="font-bold mb-2">USUARIO ASUME TOTAL RESPONSABILIDAD:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>CONSULTAR SIEMPRE con nutriólogo, médico o especialista de confianza antes de consumir cualquier receta o ingrediente.</li>
                    <li>Verificar personalmente etiquetas de productos y composiciones de ingredientes.</li>
                    <li>Conocer sus propias restricciones alimentarias y alergias.</li>
                  </ul>
                  <p className="font-bold mt-2">La Aplicación es EDUCACIVA únicamente. NO constituye consejo médico, nutricional ni profesional.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-bold mb-2">DISPONIBILIDAD TEMPORAL LIMITADA</p>
                  <p className="mb-2">La Aplicación tiene una disponibilidad temporal limitada exclusivamente al período académico del Proyecto Integrador II (marzo-abril 2026).</p>
                  <p className="mb-2">NO nos comprometemos a mantener la Aplicación en línea más de 25 días naturales después de la fecha de entrega oficial del proyecto.</p>
                  <p className="mb-2">Sin previo aviso, la Aplicación podrá ser desconectada permanentemente por:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                    <li>Finalización del proyecto académico</li>
                    <li>Cierre de servidores temporales</li>
                    <li>Falta de recursos para mantenimiento</li>
                    <li>Cualquier motivo académico o técnico</li>
                  </ul>
                  <p className="font-bold">LOS USUARIOS NO PODRÁN RECLAMAR:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Continuidad del servicio</li>
                    <li>Acceso futuro a datos ingresados</li>
                    <li>Recuperación de información tras el cierre</li>
                  </ul>
                </div>
              </div>
            </div>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">6. Uso Aceptable</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Usted se compromete a utilizar la Aplicación únicamente con fines educativos o de demostración, no realizar ingeniería inversa, descompilación ni extracción de código fuente, y no sobrecargar los servidores ni realizar ataques de denegación de servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">7. Propiedad Intelectual</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Todo el código fuente, diseño y contenido pertenece exclusivamente a los estudiantes desarrolladores. Se permite uso personal y no comercial para fines educativos. Prohibida la reproducción, distribución o uso comercial sin autorización escrita.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">8. Modificaciones y Terminación</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Podemos suspender o terminar su acceso sin previo aviso por cualquier motivo. Los Términos pueden modificarse en cualquier momento. El uso continuado implica aceptación.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">9. Ley Aplicable</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Estos Términos se rigen por las leyes de México. Cualquier controversia será resuelta en Tuxtla Gutiérrez, Chiapas.
              </p>
            </section>
          </div>

          {/* Privacy Notice */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AVISO DE PRIVACIDAD</h3>
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), le informamos:</strong></p>
              
              <div className="space-y-3">
                <p><strong>1. Identidad del Responsable:</strong> Estudiantes de Ingeniería en Tecnologías de la Información e Innovación Digital, Universidad Politécnica de Chiapas.</p>
                
                <p><strong>2. Datos Recabados:</strong> Datos personales básicos: Nombre, Correo electrónico. NO se recaban datos sensibles (salud, origen étnico, religión, etc.).</p>
                
                <p><strong>3. Finalidades del Tratamiento:</strong> Exclusivamente académicas: Registro de usuarios para demostración funcional, Pruebas de sistema durante desarrollo del proyecto integrador. NO comercial, NO marketing, NO venta a terceros.</p>
                
                <p><strong>4. Base Legal:</strong> Tratamiento basado en consentimiento expreso mediante aceptación de este Aviso.</p>
                
                <p><strong>5. Transferencia de Datos:</strong> NO se transfieren datos a terceros. Los datos permanecerán en servidores locales durante la duración del proyecto académico.</p>
                
                <p><strong>6. Derechos ARCO:</strong> Usted puede ejercer Acceso, Rectificación, Cancelación y Oposición (derechos ARCO) enviando solicitud a: Correo: equipobirewise@gmail.com (correo ficticio para el proyecto) - Plazo de respuesta: 20 días hábiles.</p>
                
                <p><strong>7. Medidas de Seguridad:</strong> Se aplican medidas básicas de protección (contraseñas, cifrado en tránsito). Dado el carácter académico, NO garantizamos seguridad nivel empresarial.</p>
                
                <p><strong>8. Cookies y Tecnologías Similares:</strong> NO utilizamos cookies ni tecnologías de rastreo.</p>
                
                <p><strong>9. Modificaciones al Aviso:</strong> Cualquier cambio se notificará en la Aplicación. El uso continuado implica aceptación.</p>
                
                <p><strong>10. Contacto:</strong> Para cualquier duda: equipobirewise@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
          <div className="space-y-3">
            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
            )}

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-500 border-gray-300 dark:border-zinc-600 rounded focus:ring-emerald-500 focus:ring-2 dark:bg-zinc-800"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                He leído, comprendo y acepto expresamente los Términos y Condiciones de Uso así como el Aviso de Privacidad de la aplicación BiteWise. Entiendo que este es un proyecto académico con fines educativos únicamente y asumo toda la responsabilidad descrita en las advertencias médicas y limitaciones de responsabilidad.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={!accepted || loading}
                className="flex-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 px-8"
              >
                {loading ? 'Registrando...' : 'Aceptar y Registrarse'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
