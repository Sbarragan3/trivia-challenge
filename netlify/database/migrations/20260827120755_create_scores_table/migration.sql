CREATE TABLE "scores" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
