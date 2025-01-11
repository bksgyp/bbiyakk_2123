"use client";
import Image from 'next/image';
import React, { useState } from 'react';

export default function Category({ toggleChecklist, setIsCategoryVisible, setShowTitle }) {
    const [showEmployment, setShowEmployment] = useState(false);
    const [showDepartment, setShowDepartment] = useState(false);
    const [showScholarship, setShowScholarship] = useState(false);
    const [showClub, setShowClub] = useState(false);

    const handleEmploymentClick = () => {
        setShowEmployment(!showEmployment);
        setShowDepartment(false);
        setShowScholarship(false);
        setShowClub(false);
    };

    const handleDepartmentClick = () => {
        setShowEmployment(false);
        setShowDepartment(!showDepartment);
        setShowScholarship(false);
        setShowClub(false);
    };

    const handleScholarshipClick = () => {
        setShowEmployment(false);
        setShowDepartment(false);
        setShowScholarship(!showScholarship);
        setShowClub(false);
    };

    const handleClubClick = () => {
        setShowEmployment(false);
        setShowDepartment(false);
        setShowScholarship(false);
        setShowClub(!showClub);
    };

    return (
        <>
            <Image
                src="/menu.png"
                alt="category"
                width={25}
                height={25}
                className='absolute top-3 left-6 cursor-pointer'
                onClick={()=>{toggleChecklist()}}
            />
            
            <div className="flex flex-col w-screen h-screen justify-start items-start pl-5 pt-12">
                <div className="text-left text-xl font-bold space-y-2 pl-3">
                    <button onClick={handleEmploymentClick} className="mb-2 text-left focus:outline-none">
                        전체 공지사항
                    </button>
                    {showEmployment && (
                        <div className="flex flex-col pl-5 text-xl text-gray-400 space-y-2">
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["전체","학사"])}}>학사</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["전체","특강"])}}>특강</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["전체","모집/채용"])}}>모집/채용</p>
                        </div>
                    )}
                    <br/>
                    <button onClick={handleDepartmentClick} className="mt-6 pb-2 text-left focus:outline-none">
                        학과 공지사항
                    </button>
                    {showDepartment && (
                        <div className="flex flex-col pl-5 text-xl text-gray-400 space-y-2">
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["학과","학부"])}}>학부</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["학과","대학원"])}}>대학원</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["학과","학과"])}}>학과</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["학과","교내"])}}>교내</p>
                        </div>
                    )}
                    <br/>
                    <button onClick={handleScholarshipClick} className="mt-6 pb-2 text-left focus:outline-none">
                        장학금 안내
                    </button>
                    {showScholarship && (
                        <div className="flex flex-col pl-5 text-xl text-gray-400 space-y-2">
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["장학금","학부-국가장학"])}}>학부-국가장학</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["장학금","학부-교내장학"])}}>학부-교내장학</p>
                            <p onClick={()=>{setIsCategoryVisible(false); setShowTitle(["장학금","학부-교외장학"])}}>학부-교외장학</p>
                        </div>
                    )}
                    <br/>
                    <button className="mt-6 mb-2 text-left focus:outline-none" onClick={()=>{setIsCategoryVisible(false); setShowTitle(["동아리","동아리 안내"])}}>
                        동아리 안내
                    </button>
                </div>
            </div>
        </>
    );
}
