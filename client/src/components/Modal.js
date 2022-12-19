import { useState } from "react";

export default function Modal({children}) {
    // Modal Window의 가시성을 결정하는 state
    const [active, setActive] = useState(false);

    return (
        <>
            <button onClick={() => setActive(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-1"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"/></svg>
            </button>

            {active && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10">
                    <ul className="bg-white w-48 rounded">
                        {children}
                        <li>
                            <button className="w-full p-1 text-red-400" onClick={() => setActive(false)}>Close</button>
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}