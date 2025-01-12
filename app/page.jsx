"use client"

import FullCalendar from '@/components/FullCalendar';
import Link from 'next/link';
import Checklist from '@/components/checklist';
import Category from '@/components/Category';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePledge } from '@/context/PledgeContext';

export default function Home() {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [showTitle, setShowTitle] = useState("");
  const touchStartX = useRef(0);
  const router = useRouter();
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [virtualdata, setVirtualdata] = useState([]);
  const { globalPledge } = usePledge();

  useEffect(() => {
    //console.log("Session data:", session);
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
    <div className='w-full h-full mb-[10px] pt-48' onClick={closeChecklist}>
      <div className="absolute top-0 left-0 flex items-start gap-4 mb-6 mt-4 px-8 pl-10 pt-10">
        <Avatar
          className='w-[80px] h-[80px]'
          src={session?.user?.image}
          onClick={() => {
            if (session) {
              router.push('/settings');
            } else {
              router.push('/login');
            }
          }}
        />
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">
            {session?.user?.name || "게스트"}
          </span>
          <div>
            <p id="goal">{globalPledge}</p>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <span className="text-sm text-gray-500 cursor-pointer">
                전체 ▼
              </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="Calendar Actions">
              <DropdownItem key="personal">북북독서왕</DropdownItem>
              <DropdownItem key="work">running</DropdownItem>
              <DropdownItem key="family">영어 배우쟈</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        
      </div>

      {/* <Image
        src="/menu.png"
        alt="menu"
        width={25}
        height={25}
        onClick={(e) => {
          e.stopPropagation();
          toggleChecklist();
        }}
        className='absolute top-3 left-6 cursor-pointer'
      /> */}
      
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
      <FullCalendar setEvents={setEvents} events={events} virtualdata={virtualdata} setVirtualdata={setVirtualdata}/>

      {/* <div className="flex justify-center">
        <FullCalendar setEvents={setEvents} events={events}/>
      </div> */}
    </div>
  );
}
