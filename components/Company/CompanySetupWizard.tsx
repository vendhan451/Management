import React, { useState } from 'react';
import CompanyProfileForm from './CompanyProfileForm';
import LogoUpload from './LogoUpload';

const CompanySetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div>
      <h2>Company Setup Wizard</h2>
      {step === 1 && <LogoUpload onNext={nextStep} />}
      {step === 2 && <CompanyProfileForm onBack={prevStep} onNext={nextStep} />}
      {/* Add more steps as needed */}
    </div>
  );
};

export default CompanySetupWizard;
