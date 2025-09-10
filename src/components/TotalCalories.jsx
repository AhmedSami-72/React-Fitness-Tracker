import { useMemo } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function TotalCalories({ workouts = [], isLoading = false }) {
  const theme = useTheme();

  const totalCalories = useMemo(() => {
    return workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
  }, [workouts]);

  const totalWorkouts = workouts.length;

  const averageCalories = useMemo(() => {
    return totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
  }, [totalCalories, totalWorkouts]);

  if (isLoading) {
    return (
      <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
        <div className="animate-pulse">
          <div className={`h-6 ${theme.bg.overlayHover} rounded mb-4`}></div>
          <div className={`h-12 ${theme.bg.overlayHover} rounded mb-2`}></div>
          <div className={`h-4 ${theme.bg.overlayHover} rounded w-2/3`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className={`p-2 ${theme.bg.overlayHover} rounded-lg`}>
          <Flame size={20} className={theme.text.secondary} />
        </div>
        <h2 className={`text-lg sm:text-xl font-bold ${theme.text.primary}`}>
          Calories Summary
        </h2>
      </div>

      {/* Main Metric */}
      <div className="text-center mb-6">
        <div className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-2 ${theme.text.primary}`}>
          {totalCalories.toLocaleString()}
        </div>
        <p className={`${theme.text.muted} text-sm sm:text-base`}>
          Total Calories Burned
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Workouts */}
        <div className={`${theme.bg.overlayHover} rounded-lg p-3 sm:p-4 text-center`}>
          <div className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} mb-1`}>
            {totalWorkouts}
          </div>
          <p className={`${theme.text.muted} text-xs sm:text-sm`}>
            Total Workouts
          </p>
        </div>

        {/* Average Calories */}
        <div className={`${theme.bg.overlayHover} rounded-lg p-3 sm:p-4 text-center`}>
          <div className={`text-2xl sm:text-3xl font-bold ${theme.text.primary} mb-1`}>
            {averageCalories}
          </div>
          <p className={`${theme.text.muted} text-xs sm:text-sm`}>
            Avg per Workout
          </p>
        </div>
      </div>

      {/* Empty State */}
      {totalWorkouts === 0 && (
        <div className="text-center mt-6 py-4">
          <TrendingUp size={48} className={`${theme.text.faint} mx-auto mb-3`} />
          <p className={`${theme.text.muted} text-sm sm:text-base mb-2`}>
            No workouts recorded yet
          </p>
          <p className={`${theme.text.faint} text-xs sm:text-sm`}>
            Add your first workout to start tracking!
          </p>
        </div>
      )}

      {/* Progress Indicator */}
      {totalWorkouts > 0 && (
        <div className={`mt-6 pt-4 border-t ${theme.bg.border}`}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className={theme.text.secondary} />
            <span className={`text-xs sm:text-sm ${theme.text.secondary}`}>
              Keep up the great work!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}