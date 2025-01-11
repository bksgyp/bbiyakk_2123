"use client"

import FullCalendar from '@/components/FullCalendar';
import Link from 'next/link';
import Checklist from '@/components/checklist';
import Category from '@/components/Category';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [showTitle, setShowTitle] = useState("");
  const touchStartX = useRef(0);
  const router = useRouter();
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Session data:", session);
    if(session == null){
      router.push('/login');
    }
  }, [session]);

  const toggleChecklist = () => {
    setIsChecklistOpen((prev) => !prev);
    setIsCategoryVisible(true);
  };

  const closeChecklist = () => {
    if (isChecklistOpen) {
      setIsChecklistOpen(false);
      setIsCategoryVisible(true);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const touchEndX = e.touches[0].clientX;
    if (touchStartX.current - touchEndX > 50) { // 왼쪽으로 50px 이상 밀면
      closeChecklist();
    }
  };

  return (
    <div className='w-full h-full mb-[10px]' onClick={closeChecklist}>
      <Image
        src="/menu.png"
        alt="menu"
        width={25}
        height={25}
        onClick={(e) => {
          e.stopPropagation();
          toggleChecklist();
        }}
        className='absolute top-3 left-6 cursor-pointer'
      />
      <Avatar
        className='absolute top-1 right-6 cursor-pointer w-[33px] h-[33px]'
        src={session?.user?.image}
        onClick={() => {
          if (session) {
            router.push('/settings');
          } else {
            router.push('/login');
          }
        }}
      />
      <div
        className={`absolute top-0 left-0 h-full w-full bg-white transition-transform transform ${isChecklistOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="p-5">
          {isCategoryVisible ? (
            <Category toggleChecklist={toggleChecklist} setIsCategoryVisible={setIsCategoryVisible} setShowTitle={setShowTitle} />
          ) : (
            <Checklist toggleChecklist={toggleChecklist} setIsCategoryVisible={setIsCategoryVisible} showTitle={showTitle} setEvents={setEvents} events={events}/>
          )}
        </div>
      </div>
      <FullCalendar setEvents={setEvents} events={events}/>
    </div>
  );
}
