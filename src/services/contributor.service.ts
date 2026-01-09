import { httpClient } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface Contributor {
  _id: string;
  name: string;
  nickname: string;
  image: string;
  bio?: string;
  profession?: string;
}

export interface ContributorsResponse {
  success: boolean;
  status: string;
  data: Contributor[];
  page: number;
  size: number;
  total: number;
}

export const contributorService = {
  getAllContributors: async (): Promise<ContributorsResponse> => {
    const response = await httpClient.get(API_ENDPOINTS.CONTRIBUTORS);
    return response.data;
  },

  getContributorById: async (
    id: string
  ): Promise<{ success: boolean; data: Contributor }> => {
    const response = await httpClient.get(
      `${API_ENDPOINTS.CONTRIBUTORS}/${id}`
    );
    return response.data;
  },
};
