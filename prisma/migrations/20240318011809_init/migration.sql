-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80),
    "email" VARCHAR(80),
    "password" VARCHAR(80),
    "createat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "roles" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
