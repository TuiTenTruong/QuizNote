import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { createReward, deleteReward, getAllRewards, updateReward } from '../api/reward.api';
import type { IReward, IRewardFormData, RewardFilterStatus, RewardModalType } from '../types/reward';

const INITIAL_FORM_DATA: IRewardFormData = {
    name: '',
    description: '',
    cost: '',
    stockQuantity: '',
    inStock: true,
    active: true
};

const toBool = (value: unknown): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }

    return Boolean(value);
};

const toNumber = (value: string | number | undefined): number => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const mapRewardToFormData = (reward: IReward): IRewardFormData => ({
    name: reward.name,
    description: reward.description || '',
    cost: String(reward.cost ?? ''),
    stockQuantity: String(reward.stockQuantity ?? reward.quantity ?? ''),
    inStock: reward.inStock,
    active: reward.isActive ?? reward.active ?? true
});

export const useRewardQuery = () => {
    const [rewards, setRewards] = useState<IReward[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRewards = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllRewards(0, 100);
            if (response && response.data) {
                setRewards(response.data.result || []);
            }
        } catch (error) {
            console.error('Failed to fetch rewards:', error);
            toast.error('Khong the tai danh sach qua tang');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRewards();
    }, [fetchRewards]);

    return {
        rewards,
        setRewards,
        loading,
        setLoading,
        fetchRewards
    };
};

export const useRewardFilter = (rewards: IReward[]) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<RewardFilterStatus>('All');

    const filteredRewards = useMemo(() => {
        return rewards.filter((reward) => {
            const matchSearch =
                reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reward.description || '').toLowerCase().includes(searchTerm.toLowerCase());

            const rewardActive = reward.isActive ?? reward.active ?? true;
            const rewardStock = reward.inStock;
            const matchStatus =
                filterStatus === 'All' ||
                (filterStatus === 'Active' && rewardActive) ||
                (filterStatus === 'Inactive' && !rewardActive) ||
                (filterStatus === 'InStock' && rewardStock) ||
                (filterStatus === 'OutOfStock' && !rewardStock);

            return matchSearch && matchStatus;
        });
    }, [rewards, searchTerm, filterStatus]);

    return {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        filteredRewards
    };
};

export const useRewardModalState = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<RewardModalType>('');
    const [selectedReward, setSelectedReward] = useState<IReward | null>(null);

    const openModal = useCallback((type: RewardModalType, reward: IReward | null = null) => {
        setModalType(type);
        setSelectedReward(reward);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setModalType('');
        setSelectedReward(null);
    }, []);

    return {
        showModal,
        modalType,
        selectedReward,
        openModal,
        closeModal
    };
};

export const useRewardFormState = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [formData, setFormData] = useState<IRewardFormData>(INITIAL_FORM_DATA);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setImageFile(null);
        setPreviewUrl('');
    }, []);

    const setFormFromReward = useCallback((reward: IReward) => {
        setFormData(mapRewardToFormData(reward));
        setImageFile(null);
        setPreviewUrl(reward.imageUrl || '');
    }, []);

    const handleShowModal = useCallback((type: RewardModalType, reward: IReward | null = null) => {
        if (type === 'create') {
            resetForm();
        } else if (type === 'edit' && reward) {
            setFormFromReward(reward);
        }
    }, [resetForm, setFormFromReward]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        const checked = type === 'checkbox' && 'checked' in event.target ? event.target.checked : undefined;

        const nextFormData: IRewardFormData = {
            ...formData,
            [name]: type === 'checkbox' ? Boolean(checked) : value
        } as IRewardFormData;

        if (name === 'stockQuantity' && toNumber(value) === 0) {
            nextFormData.inStock = false;
        }

        if (name === 'active') {
            nextFormData.active = toBool(value);
        }

        setFormData(nextFormData);
    }, [formData]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(String(reader.result || ''));
            };
            reader.readAsDataURL(file);
            return;
        }

        setImageFile(null);
        setPreviewUrl('');
    }, []);

    return {
        imageFile,
        previewUrl,
        formData,
        setFormData,
        resetForm,
        setFormFromReward,
        handleShowModal,
        handleInputChange,
        handleFileChange
    };
};

export const useRewardActions = (
    modalType: RewardModalType,
    selectedReward: IReward | null,
    formData: IRewardFormData,
    imageFile: File | null,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    fetchRewards: () => Promise<void>,
    handleCloseModal: () => void
) => {
    const buildRequestFormData = useCallback(() => {
        const payload = new FormData();

        const rewardData = {
            name: formData.name,
            description: formData.description,
            cost: toNumber(formData.cost),
            stockQuantity: toNumber(formData.stockQuantity),
            inStock: formData.inStock,
            active: formData.active
        };

        payload.append(
            'reward',
            new Blob([JSON.stringify(rewardData)], {
                type: 'application/json'
            })
        );

        if (imageFile) {
            payload.append('image', imageFile);
        }

        return payload;
    }, [formData, imageFile]);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const requestData = buildRequestFormData();

            let response;
            if (modalType === 'create') {
                response = await createReward(requestData);
                toast.success('Tao qua tang thanh cong');
            } else if (modalType === 'edit' && selectedReward) {
                response = await updateReward(selectedReward.id, requestData);
                toast.success('Cap nhat qua tang thanh cong');
            }

            if (response) {
                await fetchRewards();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error submitting reward:', error);
            toast.error('Co loi xay ra. Vui long thu lai.');
        } finally {
            setLoading(false);
        }
    }, [buildRequestFormData, fetchRewards, handleCloseModal, modalType, selectedReward]);

    const handleDelete = useCallback(async () => {
        if (!selectedReward) {
            return;
        }

        setLoading(true);
        try {
            const response = await deleteReward(selectedReward.id);
            if (response) {
                toast.success('Xoa qua tang thanh cong');
                await fetchRewards();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error deleting reward:', error);
            toast.error('Khong the xoa qua tang');
        } finally {
            setLoading(false);
        }
    }, [fetchRewards, handleCloseModal, selectedReward]);

    return {
        handleSubmit,
        handleDelete
    };
};
