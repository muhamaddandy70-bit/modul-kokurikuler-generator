
import React, { useState } from 'react';
import type { FormData } from '../types';
import { FASES, THEMES, SUBTHEMES_BY_THEME, JENIS_KOKURIKULER, DIMENSIONS, PEDAGOGIES, ENVIRONMENTS } from '../constants';
import { LoadingIcon } from './icons';

interface InputFormProps {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    nama_sekolah: '',
    fase_kelas: '',
    tema: '',
    subtema: '',
    subtema_lainnya: '',
    alokasi_waktu: '',
    jenis_kokurikuler: '',
    jenis_kokurikuler_lainnya: '',
    dimensi_pilihan: [],
    pilihan_pedagogik: '',
    pilihan_lingkungan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tema') {
       setFormData(prev => ({
        ...prev,
        tema: value,
        subtema: '',
        subtema_lainnya: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newDimensions = checked
        ? [...prev.dimensi_pilihan, value]
        : prev.dimensi_pilihan.filter(d => d !== value);
      return { ...prev, dimensi_pilihan: newDimensions };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.dimensi_pilihan.length < 2){
        alert("Mohon pilih minimal 2 dimensi Profil Pelajar Pancasila.");
        return;
    }
    onGenerate(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama_sekolah" className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
          <input type="text" name="nama_sekolah" id="nama_sekolah" value={formData.nama_sekolah} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required/>
        </div>

        <div>
          <label htmlFor="fase_kelas" className="block text-sm font-medium text-gray-700">Fase / Kelas</label>
          <select id="fase_kelas" name="fase_kelas" value={formData.fase_kelas} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
            <option value="" disabled>Pilih Fase / Kelas...</option>
            {FASES.map(fase => <option key={fase} value={fase}>{fase}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="tema" className="block text-sm font-medium text-gray-700">Tema Utama P5</label>
          <select id="tema" name="tema" value={formData.tema} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
            <option value="" disabled>Pilih Tema...</option>
            {THEMES.map(theme => <option key={theme} value={theme}>{theme}</option>)}
          </select>
        </div>

        {formData.tema && (
          <div>
            <label htmlFor="subtema" className="block text-sm font-medium text-gray-700">Subtema / Topik Projek</label>
            <select id="subtema" name="subtema" value={formData.subtema} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
              <option value="" disabled>Pilih Subtema...</option>
              {(SUBTHEMES_BY_THEME[formData.tema] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
        )}

        {formData.subtema === 'Lainnya' && (
          <div>
              <label htmlFor="subtema_lainnya" className="block text-sm font-medium text-gray-700">Sebutkan Subtema Lainnya</label>
              <input
                  type="text"
                  name="subtema_lainnya"
                  id="subtema_lainnya"
                  value={formData.subtema_lainnya}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Isi subtema/topik projek..."
                  required
              />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="alokasi_waktu" className="block text-sm font-medium text-gray-700">Alokasi Waktu</label>
              <input type="text" name="alokasi_waktu" id="alokasi_waktu" value={formData.alokasi_waktu} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Contoh: 24 JP" required/>
            </div>
             <div>
              <label htmlFor="jenis_kokurikuler" className="block text-sm font-medium text-gray-700">Jenis Kokurikuler</label>
              <select id="jenis_kokurikuler" name="jenis_kokurikuler" value={formData.jenis_kokurikuler} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                <option value="" disabled>Pilih Jenis...</option>
                {JENIS_KOKURIKULER.map(jenis => <option key={jenis} value={jenis}>{jenis}</option>)}
              </select>
            </div>
        </div>
        
        {formData.jenis_kokurikuler === 'Lainnya' && (
            <div>
                <label htmlFor="jenis_kokurikuler_lainnya" className="block text-sm font-medium text-gray-700">Sebutkan Jenis Lainnya</label>
                <input
                    type="text"
                    name="jenis_kokurikuler_lainnya"
                    id="jenis_kokurikuler_lainnya"
                    value={formData.jenis_kokurikuler_lainnya}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Isi jenis kokurikuler..."
                    required
                />
            </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensi Pilihan (Pilih min. 2)</label>
          <div className="mt-2 space-y-2">
            {DIMENSIONS.map(dim => (
              <div key={dim} className="flex items-center">
                <input id={dim} name="dimensi_pilihan" type="checkbox" value={dim} checked={formData.dimensi_pilihan.includes(dim)} onChange={handleDimensionChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor={dim} className="ml-3 block text-sm text-gray-900">{dim}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="pilihan_pedagogik" className="block text-sm font-medium text-gray-700">Praktik Pedagogik</label>
          <select id="pilihan_pedagogik" name="pilihan_pedagogik" value={formData.pilihan_pedagogik} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
            <option value="" disabled>Pilih Praktik...</option>
            {PEDAGOGIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="pilihan_lingkungan" className="block text-sm font-medium text-gray-700">Kondisi Lingkungan Belajar</label>
          <select id="pilihan_lingkungan" name="pilihan_lingkungan" value={formData.pilihan_lingkungan} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
            <option value="" disabled>Pilih Lingkungan...</option>
            {ENVIRONMENTS.map(env => <option key={env} value={env}>{env}</option>)}
          </select>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            {isLoading ? <LoadingIcon /> : 'Generate Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
