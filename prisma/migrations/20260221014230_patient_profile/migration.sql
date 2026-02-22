-- CreateTable
CREATE TABLE "public"."PatientHealthProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "smoking" BOOLEAN,
    "alcohol" BOOLEAN,
    "activityLevel" TEXT,
    "sleepHours" DOUBLE PRECISION,
    "previousTreatment" TEXT,
    "previousResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientHealthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientHealthProfile_userId_key" ON "public"."PatientHealthProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."PatientHealthProfile" ADD CONSTRAINT "PatientHealthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
