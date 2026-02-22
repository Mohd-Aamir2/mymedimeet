import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // find user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    const savedProfile = await db.patientHealthProfile.create({
      data: {
        userId: user.id, // 🔥 REQUIRED

        age: body.age ? Number(body.age) : null,
        gender: body.gender || null,
        height: body.height ? Number(body.height) : null,
        weight: body.weight ? Number(body.weight) : null,
        bmi: body.bmi ? Number(body.bmi) : null,
        sleepHours: body.sleepHours
          ? Number(body.sleepHours)
          : null,
        activityLevel: body.activityLevel || null,
        smoking: body.smoking ?? null,
        alcohol: body.alcohol ?? null,
      },
    })

    return Response.json(savedProfile)
  } catch (error) {
    console.error("SAVE ERROR:", error)
    return new Response("Error saving profile", { status: 500 })
  }
}