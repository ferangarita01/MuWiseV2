// src/app/api/migrate-unified/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MigrationTools } from "@/lib/migration/migrationTools";

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const migrationTools = new MigrationTools();

    switch (action) {
      case 'migrate-users':
        const userResult = await migrationTools.migrateUsers();
        return NextResponse.json({
          success: true,
          action: 'migrate-users',
          result: userResult
        });

      case 'migrate-agreements':
        const agreementResult = await migrationTools.migrateAgreements();
        return NextResponse.json({
          success: true,
          action: 'migrate-agreements',
          result: agreementResult
        });

      case 'migrate-files':
        const fileResult = await migrationTools.migrateFiles();
        return NextResponse.json({
          success: true,
          action: 'migrate-files',
          result: fileResult
        });

      case 'full-migration':
        const fullResult = await migrationTools.runFullMigration();
        return NextResponse.json({
          success: true,
          action: 'full-migration',
          result: fullResult
        });

      case 'validate':
        const validationResult = await migrationTools.validateMigration();
        return NextResponse.json({
          success: true,
          action: 'validate',
          result: validationResult
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Migration API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Migration failed"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Migration API",
    availableActions: [
      'migrate-users',
      'migrate-agreements', 
      'migrate-files',
      'full-migration',
      'validate'
    ]
  });
}
