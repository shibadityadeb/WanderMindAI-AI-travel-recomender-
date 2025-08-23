"use client"

import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const CreateUser=useMutation(api.user.CreateNewUser)
const {user}=useUser()
const [userDetail,setUserDetail]=useState<any>()
  const CreateNewUser = async () => {
    if (user) {
      // save new user if not exist
      const result = await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user?.imageUrl,
        name: user?.fullName ?? ''
      });
      setUserDetail(result)
    }
  };

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div>
      <Header />
      {children}
    </div>
    </UserDetailContext.Provider>
  );
}

export default Provider


//import { UserDetailContext } from '@/context/UserDetailContext';

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}