export interface Contributor {
  _id: string;
  name: string;
  email: string;
  nickname?: string;
  address?: string;
  profession?: string;
  image?: string;
  phone?: string;
  detail?: string;
  _contributor?: string;
  lastpayout?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContributorResponse {
  success: boolean;
  status: string;
  data: Contributor[];
  page: number;
  size: number;
  total: number;
  sortOptions?: Record<string, number>;
}

export interface SingleContributorResponse {
  success: boolean;
  status: string;
  data: Contributor;
}

export interface CreateContributorDTO {
  name: string;
  email: string;
  nickname?: string;
  address?: string;
  profession?: string;
  image?: string;
  phone?: string;
  detail?: string;
}

export interface UpdateContributorDTO {
  name?: string;
  nickname?: string;
  address?: string;
  profession?: string;
  image?: string;
  phone?: string;
  detail?: string;
  // Email and _id are usually not updatable or omitted as per docs
}
