import Button from "components/Button";
import InnerWindow from "components/InnerWindow";

const CreateUserTab = ({ createUser }: { createUser: () => void }) => {
    return (
        <div className="mt-10">
            <InnerWindow>
                <div className="flex flex-col place-items-center justify-between p-10 text-white h-[400px]">
                    <div className="flex flex-col place-items-center">
                        <h1 className="mb-5 whitespace-nowrap text-center">Create an account to stake</h1>
                        <Button onClick={() => createUser()}>Create Account</Button>
                        <p className="text-[12px] text-[#424242] mt-1">*Account creation incurs a .10 gas fee</p>
                    </div>
                    <div>
                        <h1 className="text-[#424242]">Don't have an emperor?</h1>
                        <div className="flex place-items-center justify-center">
                            <a className="flex items-center justify-center" href="https://magiceden.io/marketplace/elite_emperors" target={"_blank"} rel="noreferrer">
                                <img className="w-[25px] h-[20px]" src="/images/magiceden.svg" alt="magiceden-icon" />
                                <p>Buy Now</p>
                            </a>
                        </div>
                    </div>
                </div>
            </InnerWindow>
        </div>
    );
};

export default CreateUserTab;