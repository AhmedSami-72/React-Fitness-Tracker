import { Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../hooks/useTheme';
import AddWorkoutForm from '../components/AddWorkoutForm';
import WorkoutList from '../components/WorkoutList';
import TotalCalories from '../components/TotalCalories';

export default function FitnessTrackerPage() {
  const theme = useTheme();

  // Fetch workouts using React Query
  const { data: workouts = [], isLoading, error } = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className={`min-h-screen w-full font-inter ${theme.text.primary}`}
      style={{
        background: theme.background,
      }}
    >
      {/* Header */}
      <header className="px-4 sm:px-6 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${theme.bg.overlay} rounded-lg`}>
              <Activity size={24} className={theme.text.secondary} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Fitness Tracker
            </h1>
          </div>
          <p className={`${theme.text.muted} text-sm sm:text-base max-w-2xl`}>
            Track your workouts, monitor your progress, and stay motivated on your fitness journey.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout: Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Form and Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Add Workout Form */}
              <AddWorkoutForm />
              
              {/* Total Calories Summary */}
              <TotalCalories workouts={workouts} isLoading={isLoading} />
            </div>

            {/* Right Column - Workout List */}
            <div className="lg:col-span-8">
              <WorkoutList 
                workouts={workouts} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>

          {/* Mobile Layout Alternative - Stack */}
          <div className="lg:hidden">
            {/* Quick Stats on Mobile - Only show if we have data */}
            {!isLoading && workouts.length > 0 && (
              <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 mb-6`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${theme.text.primary}`}>
                      {workouts.length}
                    </div>
                    <div className={`text-xs ${theme.text.muted}`}>
                      Workouts
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme.text.primary}`}>
                      {workouts.reduce((sum, w) => sum + w.calories, 0).toLocaleString()}
                    </div>
                    <div className={`text-xs ${theme.text.muted}`}>
                      Calories
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${theme.text.primary}`}>
                      {workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.duration_minutes, 0) / workouts.length) : 0}
                    </div>
                    <div className={`text-xs ${theme.text.muted}`}>
                      Avg mins
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State for Initial Load */}
          {isLoading && workouts.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className={`w-8 h-8 border-2 ${theme.isDark ? 'border-white/30 border-t-white' : 'border-gray-600/30 border-t-gray-900'} rounded-full animate-spin`}></div>
                <p className={`${theme.text.muted} text-sm`}>
                  Loading your fitness data...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className={`${theme.bg.overlay} border border-red-500/20 rounded-lg p-6 max-w-md mx-auto`}>
                <h3 className="text-lg font-semibold text-red-500 mb-2">
                  Connection Error
                </h3>
                <p className={`${theme.text.muted} text-sm mb-4`}>
                  Unable to load your workout data. Please check your connection and try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className={`${theme.bg.accent} ${theme.bg.accentText} px-4 py-2 rounded-lg text-sm font-medium ${theme.isDark ? 'hover:bg-white/90' : 'hover:bg-gray-800'} transition-colors duration-200`}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-opacity-20 border-gray-300">
            <div className="text-center">
              <p className={`${theme.text.faint} text-xs sm:text-sm`}>
                Built with React & Tailwind CSS. Keep tracking, keep improving! 💪
              </p>
            </div>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}