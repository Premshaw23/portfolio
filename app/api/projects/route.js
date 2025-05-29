import { NextResponse } from "next/server";
import clientPromise from "@/lib/MongoDb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Portfolio"); // uses the default DB from the URI
    const projects = await db.collection("projects").find({}).toArray();

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
}
