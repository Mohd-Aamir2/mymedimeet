-- CreateTable
CREATE TABLE "public"."HeartAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" INTEGER NOT NULL,
    "cp" INTEGER NOT NULL,
    "trestbps" INTEGER NOT NULL,
    "chol" INTEGER NOT NULL,
    "fbs" INTEGER NOT NULL,
    "restecg" INTEGER NOT NULL,
    "thalach" INTEGER NOT NULL,
    "exang" INTEGER NOT NULL,
    "oldpeak" DOUBLE PRECISION NOT NULL,
    "riskProbability" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeartAssessment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HeartAssessment" ADD CONSTRAINT "HeartAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
