import axios from '@/lib/axios';
import { matchSorter } from 'match-sorter';
import { MainCategory } from './main-category';

const API_URL = `/category`;

export type Category = {
  mainCategoryId?: string;
  id: string;
  title: string;
  description: string;
  createdAt: string;
  mainCategory?: MainCategory;
};

export const getAllCategory = async ({ search }: { search?: string }) => {
  try {
    const response = await axios.get(API_URL);
    console.log({ data: response });
    let category = response.data.data;

    // Search functionality across multiple fields
    if (search) {
      category = matchSorter(category, search, {
        keys: ['title']
      });
    }

    return category;
  } catch (error) {
    console.error(error);
  }
};
// export const getPaginatedCategory = async ({
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
//   const allCategories = await getAllCategory({
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
