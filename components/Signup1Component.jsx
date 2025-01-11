"use client";
import { CheckboxGroup, Checkbox, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function Signup1Component({ setViewPage }) {
  // 체크박스 상태 관리를 위한 state
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 필수 항목 체크 여부 확인
  useEffect(() => {
    const requiredItems = ['terms', 'privacy'];
    const isAllRequiredChecked = requiredItems.every(item => selectedItems.includes(item));
    setIsValid(isAllRequiredChecked);
  }, [selectedItems]);

  // 모두 동의 체크박스 핸들러
  const handleAllCheck = (checked) => {
    setIsAllChecked(checked);
    if (checked) {
      setSelectedItems(['terms', 'privacy', 'marketing']);
    } else {
      setSelectedItems([]);
    }
  };

  // 개별 체크박스 핸들러
  const handleGroupChange = (value) => {
    setSelectedItems(value);
    setIsAllChecked(value.length === 3);
  };

  return (
    <>
      <div className="text-lg font-bold w-full flex pt-32">
        서비스를 이용하기 위해서
        <br></br>
        아래 이용약관에 동의해주세요.
      </div>
      <div className="pt-1 text-sm text-gray-500">
        필수 약관에 동의해야 서비스를 사용할 수 있어요.
      </div>
      <div className="pt-8">
        <Checkbox 
          isSelected={isAllChecked}
          onValueChange={handleAllCheck}
          size="lg" 
          className="h-12"
        >
          <p className="font-bold text-lg" >모두 동의합니다.</p>
        </Checkbox>
        <CheckboxGroup 
          value={selectedItems}
          onValueChange={handleGroupChange}
          className="pt-2"
        >
          <Checkbox className="h-12" value="terms">
            이용약관(필수)
          </Checkbox>
          <Checkbox className="h-12" value="privacy">
            개인정보 수집 및 이용동의(필수)
          </Checkbox>
          <Checkbox className="h-12" value="marketing">
            마케팅 정보 수신 동의(선택)
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div className="bottom-[73px] fixed pl-3.5 w-full flex">
        <Button
          variant="solid"
          color="primary"
          isDisabled={!isValid}
          onClick={() => {
            setViewPage('signup2');
          }}
          className={`w-[320px] text-white ${
            isValid ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          동의합니다.
        </Button>
      </div>
    </>
  );
};