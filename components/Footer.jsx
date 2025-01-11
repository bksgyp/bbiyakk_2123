"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Footer() {
    const router = useRouter()
    const [activeButton, setActiveButton] = useState(1)
    const buttons = [
        { id: 1, src: "/home.png", alt: "home", link: "/" },
        { id: 2, src: "/group.png", alt: "group", link: "/Group" },
        { id: 3, src: "/search.png", alt: "search", link: "/search" },
        { id: 4, src: "/setting.png", alt: "setting", link: "/settings" },
    ]

    const handleButtonClick = (id) => {
        setActiveButton(id)
        router.push(buttons[id - 1].link)
    }

    return (
        <div className="flex justify-between h-16 w-full bg-white border-t border-gray-200" id="footer">
            {buttons.map(button => (
                <div key={button.id} className='w-14'>
                    <Button
                        id="ft"
                        className={`bg-white w-14 h-14 ${
                            activeButton === button.id ? '' : ''
                        }`}
                        onPress={() => handleButtonClick(button.id)}
                        size="sm"
                    >
                        <Image
                            src={button.src}
                            alt={button.alt}
                            width={30}
                            height={30}
                            className={`${activeButton === button.id ? 'opacity-100' : 'opacity-50'}`}
                        />
                    </Button>
                </div>
            ))}
        </div>
    )
}