import { gql } from "@apollo/client";

export const QUERY_PROVINCE = gql`
  query provinces($search: String) {
    provinces(search: $search) {
      id
      name
    }
  }
`;

export const QUERY_INDUSTRY_CATEGORIES = gql`
  query IndustryCategories {
    industryCategories {
      id
      name
    }
  }
`;

export const MUTATE_REGISTER_PROJECT_OWNER = gql`
  mutation RegisterProjectOwner($input: registerProjectOwnerInput) {
    registerProjectOwner(input: $input)
  }
`;

export const QUERY_GENERATE_COMPANY_PROFILE_URL = gql`
  query GenerateCompanyProfileUrl(
    $file_type: String
    $image_mime_type: String
  ) {
    generateCompanyProfileUrl(
      file_type: $file_type
      image_mime_type: $image_mime_type
    ) {
      url
      path
    }
  }
`;
