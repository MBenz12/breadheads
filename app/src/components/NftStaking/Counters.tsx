import Card from "components/Card";
import { COLLECTION_TOTAL_COUNT, HYPERSPACE_API_KEY, NFT_CREATOR } from "config";
import { useCallback, useEffect, useState } from "react";
import { HyperspaceClient } from "hyperspace-client-js";
const hsClient = new HyperspaceClient(HYPERSPACE_API_KEY);

const Counters = ({ stakedCount, totalStakedCount, earned }: { stakedCount: number, totalStakedCount: number, earned?: JSX.Element }) => {
    const [floorPrice, setFloorPrice] = useState(0);
    const fetchPrice = useCallback(async () => {
        try {
            const res = await hsClient.getProjects({ condition: { projectIds: [NFT_CREATOR] } });
            if (res.getProjectStats.project_stats?.length) {
                const project = res.getProjectStats.project_stats[0];
                setFloorPrice(project.floor_price || 0);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);
    useEffect(() => {
        fetchPrice();
    }, [totalStakedCount, fetchPrice]);

    return (
        <div className="flex justify-center">
            <div className="mb-5 grid grid-cols-2 gap-x-1 gap-y-3 lg:flex lg:flex-row lg:place-items-center lg:gap-5">
                <Card classNames="min-w-[230px]">
                    <div className="flex flex-col whitespace-nowrap justify-center gap-5 p-2 text-white lg:mx-5 lg:my-2 lg:p-5">
                        <h1 className="max-w-full break-words font-bold text-[10px] lg:text-center">YOUR EMPERORS STAKED</h1>
                        <div className="flex place-items-center gap-5 lg:justify-center">
                            <img src="/images/emperors.svg" alt="" className="md:w-[25px] md:h-[29px] w-[21px] h-[24px]" />
                            <p className="text-[20px] lg:text-[18px]">{stakedCount}</p>
                        </div>
                    </div>
                </Card>
                <Card classNames="min-w-[230px]">
                    <div className="flex flex-col whitespace-nowrap justify-center gap-5 p-2 text-white lg:mx-5 lg:my-2 lg:p-5">
                        <h1 className="max-w-full break-words font-bold text-[10px] lg:text-center">TOTAL VALUE LOCKED</h1>
                        <div className="flex place-items-center gap-5 lg:justify-center">
                            <img src="/images/solana.svg" alt="solana" className="md:w-[19px] md:h-[16px] w-[18px] h-[15px]" />
                            <p className="text-[20px] lg:text-[18px]">
                                {(floorPrice * totalStakedCount).toLocaleString('en-us', {
                                    maximumFractionDigits: 3,
                                    minimumFractionDigits: 3,
                                })} SOL
                            </p>
                        </div>
                    </div>
                </Card>
                <Card classNames="min-w-[230px]">
                    <div className="flex flex-col whitespace-nowrap justify-center gap-5 p-2 text-white lg:mx-5 lg:my-2 lg:p-5">
                        <h1 className="max-w-full break-words font-bold text-[10px] lg:text-center">% OF TOTAL STAKED</h1>
                        <div className="flex place-items-center gap-5 lg:justify-center">
                            <img src="/images/percent.svg" alt="" className="md:w-[25px] md:h-[29px] w-[21px] h-[24px]" />
                            <p className="text-[20px] lg:text-[18px]">
                                {
                                    (totalStakedCount * 100 / COLLECTION_TOTAL_COUNT).toLocaleString('en-us', {
                                        maximumFractionDigits: 2
                                    })
                                }%
                            </p>
                        </div>
                    </div>
                </Card>
                <Card classNames="min-w-[230px]">
                    <div className="flex flex-col whitespace-nowrap justify-center gap-5 p-2 text-white lg:mx-5 lg:my-2 lg:p-5">
                        <h1 className="max-w-full break-words font-bold text-[10px] lg:text-center">XP EARNED</h1>
                        <div className="flex place-items-center gap-5 lg:justify-center">
                            <img src="/images/jewel.svg" alt="" className="md:w-[25px] md:h-[29px] w-[21px] h-[24px]" />
                            <p className="text-[20px] lg:text-[18px]">{earned || '0'}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
};

export default Counters;