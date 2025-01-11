"use client";
import { createContext } from "react";
import { Avatar } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { CloseIcon } from "@/public/CloseIcon";
import { useRouter } from "next/navigation";

export default function App() {
  const { data: session, status, update } = useSession();
  const [isBlindMode, setIsBlindMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Session updated - Current mode:", session.user.mode);
      setIsBlindMode(session.user.mode === 1);
    }
  }, [status, session]);

  const handleModeChange = async (newValue) => {
    try {
      const newMode = newValue ? 1 : 0;
      console.log("Attempting to change mode to:", newMode);

      const response = await fetch('/api/colorset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: newMode
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log("API Response:", data);

      const result = await update({
        mode: newMode
      });
      
      console.log("Session update result:", result);

      setIsBlindMode(newMode === 1);

    } catch (error) {
      console.error("Mode update failed:", error);
      setIsBlindMode(session?.user?.mode === 1);
    }
  };

  return (
    <>
      <div className="flex flex-col absolute top-5 pl-3">
        <div className="flex w-full justify-end items-center mb-7 pr-6">
          <div className="cursor-pointer" onClick={()=>{
            router.back();
          }}>
            <CloseIcon />
          </div>
        </div>
        <table className="border-collapse w-full">
          <tbody>
            <tr>
              <td className="pr-4 w-24" rowSpan="2">
                <Avatar name={session?.user?.username} className="w-24 h-24" src={session?.user?.image} />
              </td>
              <td className="text-2xl font-bold relative top-3" colSpan="2">
                <p>{session?.user?.username}</p>
                <p className="text-xs text-gray-400 font-normal mb-2">{session?.user?.major}</p>
              </td>
            </tr>
            <tr>
              <td className="items-center">
                <div className="grid">
                  <Button className="text-medium w-[90px]" color="default" variant="flat" size="sm">
                    프로필 설정
                  </Button>
                </div>
              </td>
              <td>
                <div className="grid grid-cols-2 pl-3">
                  <Button className="text-medium px-3 w-[90px]" color="default" variant="flat" size="sm" >
                    학과 설정
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pr-8">
          <div className="mt-4 pb-5 border-b">
            <div className="text-xs text-gray-400 pb-5">화면 모드</div>
            <Switch 
              isSelected={isBlindMode}
              onValueChange={handleModeChange}
              aria-label="Color blind mode toggle"
            >
              색각이상자 모드
            </Switch>
          </div>
          <div className="mt-4 pb-5 border-b">
            <div className="text-xs text-gray-400 pb-5">로그인 정보</div>
            <div className="pb-3" onClick={()=>{
              signOut();
            }}>로그아웃</div>
            <div>계정 탈퇴</div>
          </div>
          <div className="mt-4 pb-5 border-b">
            <div className="text-xs text-gray-400 pb-5">제품 정보</div>
            <div className="pb-3">웹사이트</div>
            <div className="flex justify-between w-full">
              <p>버전 정보</p>
              <p className="text-gray-400">1.17.0</p>
            </div>
          </div>
          <div className="flex w-full text-xs text-gray-400 justify-center items-center pt-2">
            copyright 2024. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
