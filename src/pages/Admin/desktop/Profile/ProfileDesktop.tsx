import { useState } from 'react';
import EditProfile from "../../mobile/Profile/EditProfile";
import EditPassword from "../../mobile/Profile/EditPassword";

const ProfileDesktop = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');

  return (
    <div style={{
      display: 'flex',
      padding: '2rem', 
      backgroundColor: 'rgb(17, 24, 39)',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      color: 'var(--mainBlack)',
      marginTop: '4rem',
      margin: '4rem auto',
      gap: '2rem'
    }}>
      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'start',
        marginTop: '4rem',
        flexDirection: 'column'
      }}>
        <button
          onClick={() => setActiveSection('profile')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeSection === 'profile' ? 'var(--mainBlue)' : 'rgba(100, 100, 100, 0.3)',
            color: 'var(--mainWhite)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Modificar datos de usuario
        </button>
        <button
          onClick={() => setActiveSection('password')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeSection === 'password' ? 'var(--mainBlue)' : 'rgba(100, 100, 100, 0.3)',
            color: 'var(--mainWhite)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Modificar Contraseña
        </button>
      </div>

      {/* Content Section */}
      <div style={{
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid rgba(100, 100, 100, 0.3)',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 1.25rem 1.6875rem 0rem',
        maxWidth: '600px',
        width: '100%',
        margin: '3rem auto 0 6rem'
      }}>
        {activeSection === 'profile' ? (
          <EditProfile desktop={true} />
        ) : (
          <EditPassword desktop={true} />
        )}
      </div>
    </div>
  );
};

export default ProfileDesktop;
