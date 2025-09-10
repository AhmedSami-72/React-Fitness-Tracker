import sql from "@/app/api/utils/sql";

// DELETE - Remove workout by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: 'Workout ID is required' },
        { status: 400 }
      );
    }

    const [deletedWorkout] = await sql`
      DELETE FROM workouts 
      WHERE id = ${id}
      RETURNING id, workout_type, duration_minutes, calories
    `;

    if (!deletedWorkout) {
      return Response.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return Response.json({ 
      message: 'Workout deleted successfully',
      workout: deletedWorkout 
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return Response.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}