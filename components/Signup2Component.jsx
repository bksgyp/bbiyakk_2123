"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter } from 'next/navigation';

// 데이터를 직접 import
import colleges from "../app/data/Colleges.json";
import engineering from "../app/data/Engineering.json";
import business from "../app/data/Business.json";
import humanities from "../app/data/Humanities.json";
import nature_science from "../app/data/Nature_Science.json";
import software_convergence from "../app/data/Software_Convergence.json";
import { useSession } from 'next-auth/react';


export default function Signup2Component({ setViewPage }) {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const router = useRouter();
  const { data: session, update } = useSession();
  // 단과대학별 학과 데이터 매핑
  const departmentMap = { // 프런티어 학부 데이터 매핑
    Engineering: engineering,
    Nature_Science: nature_science,
    Business: business,
    Humanities: humanities,
    Software_Convergence: software_convergence
  };

  // 단과대학 선택 처리
  const handleCollegeSelection = (key) => {
    const selected = colleges.find((item) => item.key === key);
    setSelectedCollege(selected);
    setSelectedDepartment(null); // 단과대학이 변경되면 학과 선택 초기화

    // 해당 단과대학의 학과 데이터 설정
    setDepartments(departmentMap[key] || []);
  };

  // 학과 선택 처리
  const handleDepartmentSelection = (key) => {
    const selected = departments.find((item) => item.key === key);
    setSelectedDepartment(selected);
  };

  // 선택 상태 확인
  const isValid = !!selectedCollege && !!selectedDepartment;

  return (
    <>
      <div className="text-lg font-bold w-full flex pt-32">
        먼저, 학사 정보를 선택해주세요.
      </div>
      <div className="pt-1 text-sm text-gray-500">
        하단 박스를 선택해야 맞춤 서비스를 제공할 수 있어요.
      </div>

      {/* 단과대학 선택 드롭다운 */}
      <div className="relative flex pt-14">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-full justify-start">
              {selectedCollege ? selectedCollege.label : "단과대학 선택"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="단과대학 선택"
            onAction={(key) => handleCollegeSelection(key)}
          >
            {colleges.map((college) => (
              <DropdownItem key={college.key}>{college.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* 학과 선택 드롭다운 */}
      <div className="pt-4">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="w-full justify-start"
              isDisabled={!selectedCollege}
            >
              {selectedDepartment ? selectedDepartment.label : "학과 선택"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="학과 선택"
            onAction={(key) => handleDepartmentSelection(key)}
          >
            {departments.map((department) => (
              <DropdownItem key={department.key}>
                {department.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* 선택된 정보 표시 */}
      <div>
        {selectedCollege && selectedDepartment && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">선택된 단과대학: {selectedCollege.label}</p>
            <p className="text-sm">선택된 학과: {selectedDepartment.label}</p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="bottom-[73px] fixed pl-3.5 w-full flex">
        <Button
          variant="solid"
          color="primary"
          isDisabled={!isValid}
          onClick={() => {
            fetch('/api/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                college: selectedCollege.label,
                department: selectedDepartment.label,
              }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Success:', data, session);
                update({
                  ...session,
                  user: {
                    major: selectedDepartment.label,
                    college: selectedCollege.label,
                  }
                });
                setViewPage('login');
                router.push('/');
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }}
          className={`w-[320px] text-white ${
            isValid ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          선택 완료
        </Button>
      </div>
    </>
  );
}