import React from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../constants';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleProceedToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-${THEME.accent} via-white to-${THEME.accent} p-6 text-center`}>
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      {/* The animate-fadeIn class will require its CSS definition to be available globally (e.g., in index.html or a linked CSS file) */}
      <main className="z-10 animate-fadeIn"> 
        <h1 className={`text-5xl md:text-7xl font-bold text-${THEME.primary} drop-shadow-lg`}>
          VENDHAN INFO TECH
        </h1>
        <p className={`mt-4 text-xl md:text-2xl text-${THEME.secondary} font-light`}>
          Empowering Your Workforce.
        </p>
        <button
          onClick={handleProceedToLogin}
          className={`mt-12 inline-flex items-center px-10 py-4 bg-${THEME.primary} text-${THEME.primaryText} text-lg font-semibold rounded-lg shadow-xl hover:bg-opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${THEME.primary} transition-all duration-300 ease-in-out hover:scale-105 transform`}
          aria-label="Proceed to Login"
        >
          Proceed to Login
          <ArrowRightIcon className="ml-3 h-6 w-6" />
        </button>
      </main>
      <footer className={`absolute bottom-6 text-center text-sm text-gray-500 z-10`}>
        <p>&copy; {new Date().getFullYear()} Vendhan Info Tech. All rights reserved.</p>
      </footer>

      {/* 
        The <style jsx global> tag was removed as it's not standard JSX/TypeScript and caused an error.
        For the animation to work, the following CSS needs to be included globally, for example,
        in a <style> tag in your index.html or in a linked CSS file:

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      */}
    </div>
  );
};

export default WelcomePage;