import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    // You can fetch data based on the slug here
    return {
      id
    };
}