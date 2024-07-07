import UsersClient from './UsersClient';

// import userService from '@/services/userService';
// import {
//   HydrationBoundary,
//   QueryClient,
//   dehydrate,
// } from '@tanstack/react-query';

export default async function UsersPage() {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ['users'],
  //   queryFn: userService.getUserList,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <UsersClient />
    // </HydrationBoundary>
  );
}
