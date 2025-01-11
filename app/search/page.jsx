"use client";
import React from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";

export const SearchIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [firstDropdownKeys, setFirstDropdownKeys] = React.useState(
    new Set(["해시태그"])
  );
  const [secondDropdownKeys, setSecondDropdownKeys] = React.useState(
    new Set(["해시태그"])
  );

  const firstSelectedValue = React.useMemo(
    () => Array.from(firstDropdownKeys).join(", ").replace(/_/g, ""),
    [firstDropdownKeys]
  );

  const secondSelectedValue = React.useMemo(
    () => Array.from(secondDropdownKeys).join(", ").replace(/_/g, ""),
    [secondDropdownKeys]
  );
  const {
    isOpen: isJoinOpen,
    onOpen: onJoinOpen,
    onOpenChange: onJoinChange,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateChange,
  } = useDisclosure();

  const [selectedCard, setSelectedCard] = React.useState(null);
  const [commitment, setCommitment] = React.useState("");
  const [selectedDays, setSelectedDays] = React.useState([]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    onJoinOpen();
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const cardData = [
    {
      title: "북북독서왕",
      description: "저희는 매주 도서관에서 만나요.",
      hashtags: "#독서 #책",
    },
    {
      title: "러닝러닝",
      description: "한강, 공원 달리기 인증샷 업로드 필수",
      hashtags: "#운동 #달리기",
    },
    {
      title: "매일크로키",
      description: "저희는 매주 그림그려요.",
      hashtags: "#그림 #크로키",
    },
  ];

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <>
      <div className="pt-16">
        {/* 검색창 */}
        <div className="w-full h-16 rounded-2xl flex justify-center items-center">
          <Input
            isClearable
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
            }}
            placeholder="소모임을 검색하세요!"
            radius="lg"
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>

        {/* 카드 리스트 */}
        <div className="w-full h-[650] overflow-y-scroll">
          {cardData.map((card, index) => (
            <div className="pt-4" key={index}>
              <Card
                isPressable
                shadow="none"
                className="w-full border-gray-400 border"
                onPress={() => handleCardClick(card)}
              >
                <CardBody className="flex gap-3">
                  <div>
                    <p className="text-md font-bold">{card.title}</p>
                    <p className="text-small text-default-500">
                      {card.hashtags}
                    </p>
                  </div>
                  <div>{card.description}</div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* 소모임 참가 모달 */}
        <Modal
          isOpen={isJoinOpen}
          onOpenChange={onJoinChange}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <p className="font-bold">
                    {selectedCard?.title}에 참가하실건가요?
                  </p>
                  <p className="text-sm text-gray-500">
                    참여하는 각오와 요일을 알려주세요.
                  </p>
                </ModalHeader>
                <ModalBody>
                  <fieldset className="border-gray-400 border-1">
                    <legend className="font-bold"> 다짐</legend>
                    <form>
                      <input
                        placeholder="입력해주세요."
                        className="ml-3 pl-2 pb-2 mb-1 w-72 pt-2"
                      ></input>
                    </form>
                  </fieldset>
                  <p className="text-sm text-gray-300">
                    - 최대 25글자까지만 입력 가능해요.
                  </p>
                  <div>
                    <p className="font-bold mb-3">참여요일</p>
                    <div className="flex justify-between gap-2">
                      {days.map((day) => (
                        <Button
                          key={day}
                          className={`rounded-full w-10 h-10 min-w-0 ${
                            selectedDays.includes(day)
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-400"
                          }`}
                          onPress={() => toggleDay(day)}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <fieldset className="border-gray-400 border-1">
                    <legend className="font-bold"> 이모지</legend>
                    <form>
                      <input className="ml-3 pl-2 pb-2 mb-1 w-72 pt-2"></input>
                    </form>
                  </fieldset>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="rounded-xl w-full"
                    color="primary"
                    onPress={onClose}
                  >
                    소모임 참여하기
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* 소모임 만들기 모달 */}
        <div className="absolute left-1/2 top-[750] transform -translate-x-1/2 -translate-y-1/2">
          <Button
            onPress={onCreateOpen}
            className="flex rounded-full min-w-0 items-center justify-center"
          >
            소모임 만들기
          </Button>
        </div>

        <Modal
          isOpen={isCreateOpen}
          onOpenChange={onCreateChange}
          placement="center"
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <p className="font-bold">어떤 소모임을 만드실건가요?</p>
                  <p className="text-sm text-gray-500">
                    해시태그를 달아 정보를 알려주세요.
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <fieldset className="border-gray-400 border-1">
                    <legend className="font-bold"> 소모임명</legend>
                    <form>
                      <input
                        placeholder="입력해주세요."
                        className="ml-3 pl-2 pb-2 mb-1 w-72 pt-2"
                      ></input>
                    </form>
                  </fieldset>
                  <p className="text-sm text-gray-300">
                    - 최대 25글자까지만 입력 가능해요.
                  </p>
                  <fieldset className="border-gray-400 border-1">
                    <legend className="font-bold"> 인원 수</legend>
                    <form>
                      <input
                        placeholder="제한하고 싶은 인원을 설정해주세요."
                        className="ml-3 pl-2 pb-2 mb-1 w-72 pt-2"
                      ></input>
                    </form>
                  </fieldset>
                    <div className="w-full flex justify-between gap-4">
                      <div className="flex-1">
                        <Dropdown className="w-full">
                          <DropdownTrigger>
                            <Button
                              className="capitalize w-full"
                              variant="bordered"
                            >
                              {firstSelectedValue}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="First dropdown selection"
                            selectedKeys={firstDropdownKeys}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={setFirstDropdownKeys}
                          >
                            <DropdownItem key="exercise">운동</DropdownItem>
                            <DropdownItem key="reading">독서</DropdownItem>
                            <DropdownItem key="art">그림</DropdownItem>
                            <DropdownItem key="conversation">회화</DropdownItem>
                            <DropdownItem key="coding">코딩</DropdownItem>
                            <DropdownItem key="liberal_arts">교양</DropdownItem>
                            <DropdownItem key="tool">툴</DropdownItem>
                            <DropdownItem key="music">음악</DropdownItem>
                            <DropdownItem key="finance">재테크</DropdownItem>
                            <DropdownItem key="cooking">요리</DropdownItem>
                            <DropdownItem key="book">책</DropdownItem>
                            <DropdownItem key="running">달리기</DropdownItem>
                            <DropdownItem key="watercolor">수채화</DropdownItem>
                            <DropdownItem key="drawing">소묘</DropdownItem>
                            <DropdownItem key="language">언어</DropdownItem>
                            <DropdownItem key="performance">공연</DropdownItem>
                            <DropdownItem key="exhibition">전시</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <div className="flex-1">
                        <Dropdown className="w-full">
                          <DropdownTrigger>
                            <Button
                              className="capitalize w-full"
                              variant="bordered"
                            >
                              {secondSelectedValue}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Second dropdown selection"
                            selectedKeys={secondDropdownKeys}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={setSecondDropdownKeys}
                          >
                            <DropdownItem key="exercise">운동</DropdownItem>
                            <DropdownItem key="reading">독서</DropdownItem>
                            <DropdownItem key="art">그림</DropdownItem>
                            <DropdownItem key="conversation">회화</DropdownItem>
                            <DropdownItem key="coding">코딩</DropdownItem>
                            <DropdownItem key="liberal_arts">교양</DropdownItem>
                            <DropdownItem key="tool">툴</DropdownItem>
                            <DropdownItem key="music">음악</DropdownItem>
                            <DropdownItem key="finance">재테크</DropdownItem>
                            <DropdownItem key="cooking">요리</DropdownItem>
                            <DropdownItem key="book">책</DropdownItem>
                            <DropdownItem key="running">달리기</DropdownItem>
                            <DropdownItem key="watercolor">수채화</DropdownItem>
                            <DropdownItem key="drawing">소묘</DropdownItem>
                            <DropdownItem key="language">언어</DropdownItem>
                            <DropdownItem key="performance">공연</DropdownItem>
                            <DropdownItem key="exhibition">전시</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                    <div>
                    <p className="font-bold mb-3">참여요일</p>
                    <div className="flex justify-between gap-2">
                      {days.map((day) => (
                        <Button
                          key={day}
                          className={`rounded-full w-10 h-10 min-w-0 ${
                            selectedDays.includes(day)
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-400"
                          }`}
                          onPress={() => toggleDay(day)}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                    <div className="text-sm">
                      <p>* 기존 소모임과 동일한 이름을 사용할 수 없습니다.</p>
                      <p>
                        * 욕설이나 타인을 비방하는 이름은 경고없이 삭제됩니다.
                      </p>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    소모임 만들기
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
