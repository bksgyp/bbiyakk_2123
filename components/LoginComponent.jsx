import { Link } from '@nextui-org/link';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

export default function LoginComponent({ setViewPage }) {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <div className="w-full max-w-sm text-left pl-3 text-2xl font-bold mb-2">
        <p className="mb-2">당신의 인생을</p>
        <p className="mb-2">효율적으로 관리할 캘린더,</p>
        <p className="mb-2">하나로 습관 들이기.</p>
      </div>
      <div className="text-left pl-3 w-full max-w-sm text-gray-500 mb-8 text-xs">
        일정 하나하나 놓치지 말고, 걱정없이 관리하세요!
      </div>

      <div className="flex flex-col items-center w-full max-w-md mt-36 space-y-3">
        <button onClick={() => signIn('google')} className="flex items-center justify-center w-full border-none outline-none rounded-full py-2">
          <Image src="/구글버튼.png" alt="Google Icon" width={330} height={50} />
        </button>
        <button onClick={() => signIn('kakao')} className="flex items-center justify-center w-full border-none outline-none rounded-full py-2">
          <Image src="/카톡버튼.png" alt="KakaoTalk Icon" width={330} height={50} />
        </button>
        {/* <button className="flex items-center justify-center w-full border-none outline-none rounded-full py-2">
          <Image src="/애플버튼.png" alt="Apple Icon" width={330} height={50} />
        </button> */}
      </div>
      
      {/* <div className="flex items-center w-full max-w-sm my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-2 text-gray-500">또는</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
        <button className="text-gray-500 underline" onClick={()=>{
          setViewPage('signup1');
        }}>다른 이메일로 로그인하기</button> */}
    </div>
  );
}
