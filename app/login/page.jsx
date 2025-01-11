"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import LoginComponent from '../../components/LoginComponent';
import Signup1Component from '../../components/Signup1Component';
import Signup2Component from '../../components/Signup2Component';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const { data: session } = useSession();
  const [viewPage, setViewPage] = useState('login');
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      setViewPage('login');
    } else if (session.user && !session.user.major) {
      setViewPage('signup1');
    } else if (session.user && session.user.major) {
      router.push('/');
    }
    //console.log(session);
  }, [session]);

  const renderView = () => {
    switch (viewPage) {
      case 'login':
        return <LoginComponent setViewPage={setViewPage} />;
      case 'signup1':
        return <Signup1Component setViewPage={setViewPage} />;
      case 'signup2':
        return <Signup2Component setViewPage={setViewPage} />;
      default:
        return <LoginComponent setViewPage={setViewPage} />;
    }
  };

  return <>{renderView()}</>;
}