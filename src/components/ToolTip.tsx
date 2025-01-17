import { Popover, PopoverButton } from "@headlessui/react";
import { useEffect, useState } from "preact/hooks";


export const ToolTip: React.FC<{ content: React.ReactNode, children?: React.ReactNode }> = ({ children, content }) => {

    const [isVisible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {

        let timeout: NodeJS.Timeout | undefined;
        if (hovered) {
            timeout = setTimeout(() => {
                setVisible(true);
            }, 500);
        } else {
            clearTimeout(timeout);
            setVisible(false);
        }
        return () => clearTimeout(timeout);

    }, [hovered])



    return (<Popover className="relative overflow-visible">
        <PopoverButton
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={() => setHovered(true)}
            className="focus:outline-none relative"
        >
            {children}
        </PopoverButton>
        {isVisible &&
            (
                <div className="absolute  bg-black text-white top-full mt-2  mb-2 px-3 py-1.5 text-sm   rounded-md shadow-md z-30 " >
                    {content}
                </div>
            )
        }

    </Popover>)
}

export default ToolTip;