"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Moredetail from "./Moredetail";
import { BackIcon } from "@/public/BackIcon";

export default function Checklist({ toggleChecklist, setIsCategoryVisible, showTitle, setEvents, events }) {
  const [activeNotice, setActiveNotice] = useState(null);
  const [majorNotices, setMajorNotices] = useState([]);
  const [myPlan, setMyPlan] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: showTitle[0], detail: showTitle[1] }),
        });
        const data = await response.json();
        setMajorNotices(data.notices || []);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setMajorNotices([]);
      }
    };

    const fetchMyPlan = async () => {
      try {
        const response = await fetch('/api/myplan', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setMyPlan(data.myplan || []);
      } catch (error) {
        console.error('Error fetching myplan:', error);
        setMyPlan([]);
      }
    };

    fetchNotices();
    fetchMyPlan();
  }, [showTitle]);

  const handleCheckboxChange = async (notice) => {
    console.log(notice);
    const isChecked = myPlan.some(plan => plan.title === notice.title);
    const updatedPlan = isChecked
      ? myPlan.filter(plan => plan.title !== notice.title)
      : [...myPlan, notice];

    console.log(updatedPlan);

    setMyPlan(updatedPlan);

    try {
      await fetch('/api/myplan', {
        method: isChecked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notice),
      });

      setEvents((prevEvents) => {
        let newEvent = {
          ...notice,
          start: new Date(notice.startdate).toISOString().split('T')[0],
          end: new Date(notice.enddate).toISOString().split('T')[0],
          resourceId: ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)],
        };

        const startDateObj = new Date(newEvent.start);
        const endDateObj = new Date(newEvent.end);
        const diffTime = Math.abs(endDateObj - startDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
          newEvent.start = new Date(endDateObj.setDate(endDateObj.getDate() - 7)).toISOString().split('T')[0];
          newEvent.title = newEvent.title + "　";
          console.log("newEvent", newEvent);
        }

        const updatedEvents = isChecked
          ? prevEvents.filter(event => event.title !== notice.title)
          : [...prevEvents, newEvent];
        return updatedEvents;
      });

    } catch (error) {
      console.error('Error updating myplan:', error);
    }
  };

  const handleTitleClick = (e, id) => {
    e.preventDefault();
    setActiveNotice(id === activeNotice ? null : id);
  };

  return (
    <>
      <Image
        src="/menu.png"
        alt="menu"
        width={25}
        height={25}
        className="absolute top-3 left-6 cursor-pointer"
        onClick={() => {
          toggleChecklist();
        }}
      />
      <div className="absolute top-3 right-6 cursor-pointer" onClick={() => {
        setIsCategoryVisible(true);
      }}>
        <BackIcon />
      </div>
      <div className="text-left text-2xl font-bold pl-5 pt-12">
        {showTitle[0]}&nbsp;공지사항
      </div>
      <div className="text-xl text-gray-600/75 font-semibold overflow-y-scroll h-[calc(100vh-150px)] overflow-x-hidden">
        {majorNotices.map((notice) => (
          <div
            key={notice.id}
            className="pt-3 pl-5 pb-4 flex items-start gap-5"
          >
            <Checkbox
              isSelected={myPlan.some(plan => plan.title === notice.title)}
              onChange={() => handleCheckboxChange(notice)}
            >
              <span
                className="break-keep cursor-pointer"
                onClick={(e) => handleTitleClick(e, notice.id)}
              >
                {notice.title}
              </span>
            </Checkbox>
            {activeNotice === notice.id && (
              <div className="absolute z-10 top-0 left-0 w-full h-full bg-white shadow-lg p-4 transition-transform transform translate-x-0">
                <Moredetail toggleChecklist={toggleChecklist} notice={notice} setActiveNotice={setActiveNotice} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}