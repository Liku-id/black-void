import { NextResponse } from 'next/server';
import client from '@/lib/api/apollo-client';
import { QUERY_INDUSTRY_CATEGORIES } from '@/lib/api/queries/ekuid-queries';
import { handleGraphQLErrorAPI } from '@/lib/api/error-handler';

// Define types for response
interface IndustryCategory {
  id: string;
  name: string;
}

interface IndustryCategoriesData {
  industryCategories: IndustryCategory[];
}

export async function GET(request: Request) {
  try {
    const response = await client.query<IndustryCategoriesData>({
      query: QUERY_INDUSTRY_CATEGORIES,
      variables: {},
      context: {
        headers: {
          "user-agent": request.headers.get("user-agent") || "",
        },
      },
    });

    const excludedCategories = [
      'Pertanian',
      'Energi',
      'Logistik/Supply Chain',
      'Properti',
      'Robotika & Drone',
      'Software as a Service (SaaS)',
      'E-Commerce',
      'Sustainable',
    ];

    const filteredCategories =
      response.data?.industryCategories.filter(
        (category) => !excludedCategories.includes(category.name)
      ) || [];

    return NextResponse.json(filteredCategories);
  } catch (error: any) {
    return handleGraphQLErrorAPI(error);
  }
}
