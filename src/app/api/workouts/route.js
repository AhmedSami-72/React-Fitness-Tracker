import sql from "@/app/api/utils/sql";

// GET - List all workouts
export async function GET(request) {
  try {
    const workouts = await sql`
      SELECT id, workout_type, duration_minutes, calories, created_at
      FROM workouts
      ORDER BY created_at DESC
    `;
    
    return Response.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return Response.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST - Create new workout
export async function POST(request) {
  try {
    const body = await request.json();
    const { workout_type, duration_minutes, calories } = body;

    // Validation
    if (!workout_type || !duration_minutes || !calories) {
      return Response.json(
        { error: 'Missing required fields: workout_type, duration_minutes, calories' },
        { status: 400 }
      );
    }

    if (duration_minutes <= 0 || calories <= 0) {
      return Response.json(
        { error: 'Duration and calories must be positive numbers' },
        { status: 400 }
      );
    }

    const [newWorkout] = await sql`
      INSERT INTO workouts (workout_type, duration_minutes, calories)
      VALUES (${workout_type}, ${duration_minutes}, ${calories})
      RETURNING id, workout_type, duration_minutes, calories, created_at
    `;

    return Response.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return Response.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}