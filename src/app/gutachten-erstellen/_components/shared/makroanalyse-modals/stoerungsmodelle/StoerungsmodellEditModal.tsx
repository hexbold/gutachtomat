'use client';

import * as FormTypes from '@/lib/core/form-types';
import { STOERUNGSMODELL_TYP_LABELS } from '@/lib/core/form-labels';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Import all model forms
import { FreitextModellForm } from './models/FreitextModellForm';
import { VerstaerkerVerlustForm } from './models/VerstaerkerVerlustForm';
import { ErlernteHilflosigkeitForm } from './models/ErlernteHilflosigkeitForm';
import { KognitionstheoretischForm } from './models/KognitionstheoretischForm';
import { TeufelskreisAngstForm } from './models/TeufelskreisAngstForm';
import { TeufelskreisZwangErkrankungForm } from './models/TeufelskreisZwangErkrankungForm';
import { TeufelskreisZwangHandlungenForm } from './models/TeufelskreisZwangHandlungenForm';
import { TeufelskreisBulimieForm } from './models/TeufelskreisBulimieForm';
import { ZweiFaktorenZwangForm } from './models/ZweiFaktorenZwangForm';
import { DreiFaktorenGASForm } from './models/DreiFaktorenGASForm';
import { KognitivSozialePhobieForm } from './models/KognitivSozialePhobieForm';
import { BiopsychosozialBorderlineForm } from './models/BiopsychosozialBorderlineForm';

interface StoerungsmodellEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: FormTypes.StoerungsmodellEntry | null;
  onUpdate: (updates: Partial<FormTypes.StoerungsmodellData>) => void;
}

export function StoerungsmodellEditModal({
  isOpen,
  onClose,
  entry,
  onUpdate
}: StoerungsmodellEditModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !entry) return null;

  const renderForm = () => {
    const { modell } = entry;

    switch (modell.typ) {
      case FormTypes.StoerungsmodellTyp.FreitextModell:
        return (
          <FreitextModellForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression:
        return (
          <VerstaerkerVerlustForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit:
        return (
          <ErlernteHilflosigkeitForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression:
        return (
          <KognitionstheoretischForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.TeufelskreisAngst:
        return (
          <TeufelskreisAngstForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung:
        return (
          <TeufelskreisZwangErkrankungForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen:
        return (
          <TeufelskreisZwangHandlungenForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.TeufelskreisBulimie:
        return (
          <TeufelskreisBulimieForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang:
        return (
          <ZweiFaktorenZwangForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.DreiFaktorenGAS:
        return (
          <DreiFaktorenGASForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.KognitivSozialePhobie:
        return (
          <KognitivSozialePhobieForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      case FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline:
        return (
          <BiopsychosozialBorderlineForm
            data={modell.data}
            onUpdate={(data) => onUpdate({ typ: modell.typ, data } as FormTypes.StoerungsmodellData)}
          />
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Unbekannter Modelltyp.</p>
          </div>
        );
    }
  };

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">
            {STOERUNGSMODELL_TYP_LABELS[entry.modell.typ]}
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
          >
            Speichern
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {renderForm()}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
