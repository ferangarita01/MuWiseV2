
'use client'
import { LegalTerms } from "../legal-terms";

export function AgreementDocument() {
    const fields = {
        Date: '2024-07-30',
        Client_Name: 'Ana Torres',
        DJ_Name: 'DJ Nova',
        Event_Type: 'Boda',
        Event_Date: '2024-08-15',
        Event_Time: '20:00 - 02:00',
        Event_Location: 'Salón de Eventos "La Cúpula"',
        Total_Fee: '1200.00 USD',
        Deposit_Amount: '400.00 USD'
    };

    return (
        <div className="leading-relaxed rounded-lg border border-secondary bg-background/50 ring-1 ring-white/5 p-5" id="doc-wrapper">
            <div className="mx-auto max-w-3xl rounded-md bg-white text-slate-900 shadow-lg ring-1 ring-inset ring-slate-900/5">
                {/* Document Header */}
                <header className="border-b border-slate-200 px-6 py-5">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">DJ Contract</div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">DJ Service Agreement</h2>
                    <p className="mt-1 text-sm text-slate-700">Un acuerdo profesional para la prestación de servicios de DJ en eventos.</p>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                        <div>
                            <div className="text-xs text-slate-500">Fecha efectiva</div>
                            <div className="font-medium text-slate-900">{fields.Date}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Cliente</div>
                            <div className="font-medium text-slate-900">{fields.Client_Name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Proveedor (DJ)</div>
                            <div className="font-medium text-slate-900">{fields.DJ_Name}</div>
                        </div>
                    </div>
                </header>

                {/* Document Body */}
                <div className="space-y-6 px-6 py-6">
                    <p className="text-sm leading-6 text-slate-700">This DJ Service Contract (the “Agreement”) is made effective as of {fields.Date}, by and between {fields.Client_Name} (“Client”) and {fields.DJ_Name} (“DJ”).</p>
                    
                    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-3 text-base font-medium text-slate-900">Detalles del Evento</h3>
                        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div><div className="text-xs text-slate-500">Tipo de evento</div><div className="font-medium text-slate-800">{fields.Event_Type}</div></div>
                            <div><div className="text-xs text-slate-500">Fecha</div><div className="font-medium text-slate-800">{fields.Event_Date}</div></div>
                            <div><div className="text-xs text-slate-500">Horario</div><div className="font-medium text-slate-800">{fields.Event_Time}</div></div>
                            <div className="sm:col-span-2"><div className="text-xs text-slate-500">Ubicación</div><div className="font-medium text-slate-800">{fields.Event_Location}</div></div>
                        </div>
                    </section>
                    
                    <section>
                        <LegalTerms />
                    </section>
                    
                    <div className="rounded-md bg-slate-50 p-4 text-xs leading-6 ring-1 ring-inset ring-slate-200 text-slate-700">
                        <p>Al firmar, confirmas que has leído y aceptas los términos de uso, política de privacidad y reconoces que tu firma electrónica es legalmente vinculante. Conserva una copia para tus registros.</p>
                    </div>

                    <section>
                        <h3 className="mb-3 text-base font-medium text-slate-900">Firmas</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="mb-2 text-xs font-medium text-slate-500">Firma del Cliente</p>
                                <div className="flex h-28 items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white">
                                    <img id="sig-client" alt="Firma cliente" className="max-h-24 hidden" />
                                    <span id="sig-client-empty" className="text-xs text-slate-400">Pendiente de firma</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                                    <span>Nombre: {fields.Client_Name}</span>
                                    <span id="sig-client-date"></span>
                                </div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="mb-2 text-xs font-medium text-slate-500">Firma del Proveedor</p>
                                <div className="flex h-28 items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-white">
                                    <img id="sig-provider" alt="Firma proveedor" className="max-h-24 hidden" />
                                    <span id="sig-provider-empty" className="text-xs text-slate-400">Pendiente de firma</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                                    <span>Nombre: {fields.DJ_Name}</span>
                                    <span id="sig-provider-date"></span>
                                </div>
                            </div>
                        </div>

                        {/* Extra signatures container */}
                        <div id="extra-signatures" className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"></div>
                    </section>
                </div>
            </div>
        </div>
    );
}

    