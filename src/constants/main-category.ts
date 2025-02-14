import axios from '@/lib/axios';
import { matchSorter } from 'match-sorter';

const API_URL = `/main-category`;

export type MainCategory = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export const getAllMainCategories = async ({ search }: { search?: string }) => {
  try {
    const response = await axios.get(API_URL);
    console.log({ data: response });
    let mainCategories = response.data.data;

    // Search functionality across multiple fields
    if (search) {
      mainCategories = matchSorter(mainCategories, search, {
        keys: ['title']
      });
    }

    return mainCategories;
  } catch (error) {
    console.error(error);
  }
};
// export const getPaginatedMainCategories = async ({
//   page = 1,
//   limit = 10,
//   categories,
//   search
// }: {
//   page?: number;
//   limit?: number;
//   categories?: string;
//   search?: string;
// }) => {
//   const allCategories = await getAllMainCategories({
//     search
//   });
//   const totalCategories = allCategories.length;

//   // Pagination logic
//   const offset = (page - 1) * limit;
//   const paginatedCategories = allCategories.slice(offset, offset + limit);

//   // Mock current time
//   const currentTime = new Date().toISOString();

//   return {
//     success: true,
//     time: currentTime,
//     message: 'Sample data for testing and learning purposes',
//     total_categories: totalCategories,
//     offset,
//     limit,
//     categories: paginatedCategories
//   };
// };
