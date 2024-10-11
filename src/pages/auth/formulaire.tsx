import { useState, useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EditUserProfile = () => {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (session && session.user) {
      const { name } = session.user;
      setFormData({
        firstname: name?.split(' ')[0] || '',
        lastname: name?.split(' ')[1] || '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };  

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const validateAddress = async (address: string) => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data.features.length > 0) {
        const { geometry } = data.features[0];
        const userLat = geometry.coordinates[1];
        const userLon = geometry.coordinates[0];

        const parisLat = 48.8566;
        const parisLon = 2.3522;

        const distance = getDistanceFromLatLonInKm(userLat, userLon, parisLat, parisLon);

        if (distance > 50) {
          setError("L'adresse doit être située dans un rayon de 50 km de Paris.");
          return false;
        }

        return true;
      } else {
        setError("Adresse non trouvée.");
        return false;
      }
    } catch (err) {
      console.error("Erreur lors de la validation de l'adresse :", err);
      setError("Erreur lors de la validation de l'adresse.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidAddress = await validateAddress(formData.address);
    if (!isValidAddress) {
      setError("L'adresse doit être située dans un rayon de 50 km de Paris.");
      return;
    }
    setError("");
    setSuccessMessage("Modifications enregistrées avec succès !");
    console.log("Données enregistrées :", formData);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #ff4757, #ff6b81)' }}>
      <div className="card shadow-lg p-4" style={{ width: '600px', borderRadius: '12px' }}>
        <div className="card-body">
          <h1 className="mb-4 text-center" style={{ color: '#ff4757' }}>Modifier les informations de l&apos;utilisateur</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} 
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nom :</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom :</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Date de naissance :</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Adresse :</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Numéro de téléphone :</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-outline-danger w-100" style={{ borderRadius: '25px' }}>
              <i className="bi bi-save me-2"></i>
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface FormulaireProps {
  [key: string]: unknown; // Autorise toutes les valeurs
}

const FormulairePage = (props: FormulaireProps) => (
  <SessionProvider>
    <EditUserProfile {...props} />
  </SessionProvider>
);

export default FormulairePage;
