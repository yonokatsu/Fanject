import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Music, MapPin, Calendar, Users } from 'lucide-react';

const steps = [
  { id: 1, title: 'Account Info', icon: CheckCircle },
  { id: 2, title: 'Artist Categories', icon: Music },
  { id: 3, title: 'Origins', icon: MapPin },
  { id: 4, title: 'Event Types', icon: Calendar },
];

const artistCategories = [
  'K-Pop', 'J-Pop', 'Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Indie', 'R&B'
];

const origins = [
  'South Korea', 'Japan', 'USA', 'UK', 'Thailand', 'China', 'Taiwan', 'Other'
];

const eventTypes = [
  'Concerts', 'Fan Meetings', 'Album Signings', 'Music Shows', 'Award Shows', 'Conventions'
];

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, updateUserProfile, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // If user already completed onboarding, redirect to dashboard
    if (userProfile && userProfile.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [user, userProfile, navigate]);

  const handleToggleSelection = (item, selectedList, setSelectedList) => {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter(i => i !== item));
    } else {
      setSelectedList([...selectedList, item]);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setLoading(true);
      const result = await updateUserProfile({
        favorite_artists: selectedArtists,
        preferred_origins: selectedOrigins,
        interested_events: selectedEventTypes,
        onboarding_completed: true,
      });

      if (result.success) {
        navigate('/dashboard');
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-4">
            <h3>Welcome to Fanject!</h3>
            <p className="text-muted">
              Let's set up your profile to personalize your experience.
            </p>
            <div className="my-4">
              <Users size={64} className="text-primary" />
            </div>
            <p>We'll help you connect with your favorite artists and fans!</p>
          </div>
        );

      case 2:
        return (
          <div className="py-4">
            <h3 className="mb-3">Favorite Artist Categories</h3>
            <p className="text-muted mb-4">Select all that apply</p>
            <div className="d-flex flex-wrap gap-2">
              {artistCategories.map((category) => (
                <button
                  key={category}
                  className={`btn ${
                    selectedArtists.includes(category)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() =>
                    handleToggleSelection(category, selectedArtists, setSelectedArtists)
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="py-4">
            <h3 className="mb-3">Preferred Origins</h3>
            <p className="text-muted mb-4">Where are your favorite artists from?</p>
            <div className="d-flex flex-wrap gap-2">
              {origins.map((origin) => (
                <button
                  key={origin}
                  className={`btn ${
                    selectedOrigins.includes(origin)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() =>
                    handleToggleSelection(origin, selectedOrigins, setSelectedOrigins)
                  }
                >
                  {origin}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="py-4">
            <h3 className="mb-3">Event Types</h3>
            <p className="text-muted mb-4">What events are you interested in?</p>
            <div className="d-flex flex-wrap gap-2">
              {eventTypes.map((eventType) => (
                <button
                  key={eventType}
                  className={`btn ${
                    selectedEventTypes.includes(eventType)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() =>
                    handleToggleSelection(eventType, selectedEventTypes, setSelectedEventTypes)
                  }
                >
                  {eventType}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`text-center ${
                          step.id <= currentStep ? 'text-primary' : 'text-muted'
                        }`}
                      >
                        <Icon size={24} className="mb-1" />
                        <small className="d-none d-md-block">{step.title}</small>
                      </div>
                    );
                  })}
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={handleBack}
                  disabled={currentStep === 1 || loading}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading
                    ? 'Completing...'
                    : currentStep === 4
                    ? 'Complete Setup'
                    : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
