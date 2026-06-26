import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AnalyzerService } from '@/services/analyzer';

// Define schema for input validation using Zod
const analyzeRequestSchema = z.object({
  company: z.string({
    required_error: 'Company name is required',
    invalid_type_error: 'Company name must be a string',
  }).trim().min(1, 'Company name cannot be empty'),
});

/**
 * POST handler for /api/analyze
 * Analyzes the requested company and returns a detailed investment dossier.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    // 2. Validate input fields using Zod schema
    const validationResult = analyzeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Map Zod errors to a clear readable format
      const errorMessages = validationResult.error.errors.map(err => err.message).join(', ');
      return NextResponse.json(
        { error: errorMessages },
        { status: 400 }
      );
    }

    // 3. Delegate to the Service Layer
    const result = await AnalyzerService.analyzeCompany(validationResult.data);

    // 4. Return success response
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/analyze route:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while processing the analysis.' },
      { status: 500 }
    );
  }
}
