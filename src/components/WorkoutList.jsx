import { useState } from 'react';
import { Trash2, Clock, Activity, Flame, Loader2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutList({ workouts = [], isLoading = false, error = null }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Delete workout mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete workout');
      }
      
      return response.json();
    },
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setShowDeleteConfirm(null);
      setDeletingId(null);
    },
    onError: (error) => {
      console.error('Failed to delete workout:', error);
      setDeletingId(null);
    },
  });

  const handleDeleteClick = (id) => {
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = (id) => {
    deleteWorkoutMutation.mutate(id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.text.primary}`}>
          Workout History
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${theme.bg.overlayHover} rounded-lg p-4 animate-pulse`}>
              <div className={`h-5 ${theme.bg.overlay} rounded mb-2`}></div>
              <div className={`h-4 ${theme.bg.overlay} rounded w-3/4 mb-2`}></div>
              <div className={`h-4 ${theme.bg.overlay} rounded w-1/2`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.text.primary}`}>
          Workout History
        </h2>
        <div className="text-center py-8">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-500 text-sm sm:text-base mb-2">
            Failed to load workouts
          </p>
          <p className={`${theme.text.faint} text-xs sm:text-sm`}>
            {error.message || 'An error occurred while fetching workouts'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold ${theme.text.primary}`}>
            Workout History
          </h2>
          {workouts.length > 0 && (
            <span className={`${theme.bg.overlayHover} px-2 py-1 rounded text-xs sm:text-sm ${theme.text.muted}`}>
              {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Empty State */}
        {workouts.length === 0 && (
          <div className="text-center py-12">
            <Activity size={48} className={`${theme.text.faint} mx-auto mb-4`} />
            <p className={`${theme.text.muted} text-sm sm:text-base mb-2`}>
              No workouts recorded yet
            </p>
            <p className={`${theme.text.faint} text-xs sm:text-sm`}>
              Add your first workout to get started!
            </p>
          </div>
        )}

        {/* Workout List */}
        {workouts.length > 0 && (
          <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className={`${theme.bg.overlayHover} border ${theme.bg.border} rounded-lg p-4 transition-all duration-200 ${
                  deletingId === workout.id ? 'opacity-50' : 'hover:' + theme.bg.borderHover
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Workout Type */}
                    <h3 className={`font-semibold text-base sm:text-lg ${theme.text.primary} mb-2`}>
                      {workout.workout_type}
                    </h3>
                    
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className={`flex items-center gap-1 ${theme.text.muted}`}>
                        <Clock size={14} className="flex-shrink-0" />
                        <span>{workout.duration_minutes} min</span>
                      </div>
                      <div className={`flex items-center gap-1 ${theme.text.muted}`}>
                        <Flame size={14} className="flex-shrink-0" />
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <p className={`text-xs ${theme.text.faint} mt-2`}>
                      {formatDate(workout.created_at)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(workout.id)}
                    disabled={deletingId === workout.id}
                    className={`p-2 ${theme.hover.bg} rounded-md transition-all duration-200 text-red-500 hover:text-red-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
                    aria-label="Delete workout"
                  >
                    {deletingId === workout.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-6 max-w-sm w-full`}>
            <h3 className={`text-lg font-semibold mb-3 ${theme.text.primary}`}>
              Delete Workout
            </h3>
            <p className={`${theme.text.muted} mb-6 text-sm`}>
              Are you sure you want to delete this workout? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleteWorkoutMutation.isPending}
                className={`flex-1 px-4 py-2 ${theme.bg.overlayHover} border ${theme.bg.border} rounded-md ${theme.text.primary} hover:${theme.bg.borderHover} transition-colors duration-200 text-sm disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(showDeleteConfirm)}
                disabled={deleteWorkoutMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteWorkoutMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}