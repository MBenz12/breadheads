import InnerWindow from "../InnerWindow";

const Modal = ({ open, setOpen, children }: { open: boolean, setOpen: (open: boolean) => void, children: React.ReactNode }) => {
    return (
        <div className={`absolute ${open ? "flex" : "hidden"} z-50 top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.7)]`}>
            <div className="flex w-full h-full place-items-center zoom-in-animation justify-center" onClick={() => setOpen(false)}>
                <div onClick={(e) => { e.stopPropagation() }}>
                    <InnerWindow className="rounded-[30px] py-10">
                        {children}
                    </InnerWindow>
                </div>
            </div>
        </div>
    );
};

export default Modal;