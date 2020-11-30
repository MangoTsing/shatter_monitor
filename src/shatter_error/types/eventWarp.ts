import { SendType } from "./sendType";

export interface eventWarp {
    /**
     * 上报函数
     */
    report: (params: SendType) => void
}