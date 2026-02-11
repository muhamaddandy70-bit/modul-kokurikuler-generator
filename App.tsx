
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { generateCurriculumPlan } from './services/geminiService';
import type { FormData } from './types';

const App: React.FC = () => {
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    try {
      const plan = await generateCurriculumPlan(formData);
      setGeneratedPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            AI Curriculum Architect
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Generate Co-curricular Plans based on Kurikulum Merdeka
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 xl:w-1/4">
            <InputForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
          </div>
          <div className="lg:w-2/3 xl:w-3/4">
            <OutputDisplay 
              generatedText={generatedPlan}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
