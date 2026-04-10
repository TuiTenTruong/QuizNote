import type {
    IRewardDeliveryInfo,
} from "../types/reward";

export const parseRewardDeliveryInfo = (deliveryInfo?: string): IRewardDeliveryInfo => {
    if (!deliveryInfo) {
        return { name: "-", phone: "-", address: "-" };
    }

    const namePart = deliveryInfo.match(/Name:\s*([^,]+)/);
    const phonePart = deliveryInfo.match(/Phone:\s*([^,]+)/);
    const addressPart = deliveryInfo.match(/Address:\s*(.+)/);

    return {
        name: namePart ? namePart[1].trim() : "-",
        phone: phonePart ? phonePart[1].trim() : "-",
        address: addressPart ? addressPart[1].trim() : "-",
    };
};
