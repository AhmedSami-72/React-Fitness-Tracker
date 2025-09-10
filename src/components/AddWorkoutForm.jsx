import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../hooks/useTheme';

export default function AddWorkoutForm() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    workout_type: '',
    duration_minutes: '',
    calories: ''
  });
  const [errors, setErrors] = useState({});

  // Add workout mutation
  const addWorkoutMutation = useMutation({
    mutationFn: async (workoutData) => {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add workout');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setFormData({ workout_type: '', duration_minutes: '', calories: '' });
      setErrors({});
    },
    onError: (error) => {
      console.error('Failed to add workout:', error);
      setErrors({ submit: error.message });
    },
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.workout_type.trim()) {
      newErrors.workout_type = 'Workout type is required';
    }
    
    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      newErrors.duration_minutes = 'Duration must be a positive number';
    }
    
    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = 'Calories must be a positive number';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    addWorkoutMutation.mutate({
      workout_type: formData.workout_type.trim(),
      duration_minutes: parseInt(formData.duration_minutes),
      calories: parseInt(formData.calories)
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`${theme.bg.overlay} border ${theme.bg.border} rounded-lg p-4 sm:p-6`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme.text.primary}`}>
        Add New Workout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Workout Type */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>
            Workout Type
          </label>
          <input
            type="text"
            value={formData.workout_type}
            onChange={(e) => handleChange('workout_type', e.target.value)}
            className={`w-full ${theme.bg.overlayHover} border ${errors.workout_type ? 'border-red-500' : theme.bg.border} rounded-lg px-4 py-3 ${theme.text.primary} ${theme.isDark ? 'placeholder-white/40 focus:border-white/40' : 'placeholder-gray-500/60 focus:border-gray-400'} focus:outline-none transition-colors duration-200 text-sm sm:text-base`}
            placeholder="e.g., Running, Walking, Cycling"
            disabled={addWorkoutMutation.isPending}
          />
          {errors.workout_type && (
            <p className="text-red-500 text-xs mt-1">{errors.workout_type}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={formData.duration_minutes}
            onChange={(e) => handleChange('duration_minutes', e.target.value)}
            className={`w-full ${theme.bg.overlayHover} border ${errors.duration_minutes ? 'border-red-500' : theme.bg.border} rounded-lg px-4 py-3 ${theme.text.primary} ${theme.isDark ? 'placeholder-white/40 focus:border-white/40' : 'placeholder-gray-500/60 focus:border-gray-400'} focus:outline-none transition-colors duration-200 text-sm sm:text-base`}
            placeholder="30"
            disabled={addWorkoutMutation.isPending}
          />
          {errors.duration_minutes && (
            <p className="text-red-500 text-xs mt-1">{errors.duration_minutes}</p>
          )}
        </div>

        {/* Calories */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>
            Calories Burned
          </label>
          <input
            type="number"
            min="1"
            value={formData.calories}
            onChange={(e) => handleChange('calories', e.target.value)}
            className={`w-full ${theme.bg.overlayHover} border ${errors.calories ? 'border-red-500' : theme.bg.border} rounded-lg px-4 py-3 ${theme.text.primary} ${theme.isDark ? 'placeholder-white/40 focus:border-white/40' : 'placeholder-gray-500/60 focus:border-gray-400'} focus:outline-none transition-colors duration-200 text-sm sm:text-base`}
            placeholder="300"
            disabled={addWorkoutMutation.isPending}
          />
          {errors.calories && (
            <p className="text-red-500 text-xs mt-1">{errors.calories}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={addWorkoutMutation.isPending}
          className={`w-full ${theme.bg.accent} ${theme.bg.accentText} px-6 py-3 rounded-lg font-medium ${theme.isDark ? 'hover:bg-white/90' : 'hover:bg-gray-800'} transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {addWorkoutMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {addWorkoutMutation.isPending ? 'Adding Workout...' : 'Add Workout'}
        </button>

        {/* Error Display */}
        {errors.submit && (
          <div className="p-3 border border-red-500/20 bg-red-500/10 rounded-lg">
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
}