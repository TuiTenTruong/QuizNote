import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { createUser, deleteUser, getAllAdminUsers, updateUser, changeStatusUser } from '../api/user.api';
import { getAllRoles } from '../api/role.api';
import type { IPaginationMeta } from '../types/pagination';
import type { IRole } from '../types/role';
import type {
    IAdminUser,
    IAdminUserFormData,
    IReqCreateUser,
    IReqUpdateUser,
    UserGender,
    AdminUserModalType,
    AdminUserFilterStatus
} from '../types/user';

const DEFAULT_FORM_DATA: IAdminUserFormData = {
    name: '',
    email: '',
    password: '',
    gender: 'MALE',
    address: '',
    age: '',
    role: { id: 3 }
};

const DEFAULT_META: IPaginationMeta = {
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0
};

const toSafeNumber = (value: number | '' | undefined): number | undefined => {
    if (value === '' || value === undefined) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

export const useUserRolesQuery = () => {
    const [roles, setRoles] = useState<IRole[]>([]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await getAllRoles();
            const data = response?.data as unknown;

            if (Array.isArray(data)) {
                setRoles(data);
                return;
            }

            if (data && typeof data === 'object' && Array.isArray((data as { result?: IRole[] }).result)) {
                setRoles((data as { result: IRole[] }).result);
                return;
            }

            setRoles([]);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Khong the tai danh sach vai tro');
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return {
        roles,
        fetchRoles
    };
};

export const useUserListQuery = () => {
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [meta, setMeta] = useState<IPaginationMeta>(DEFAULT_META);

    const fetchUsers = useCallback(async (page: number) => {
        try {
            const response = await getAllAdminUsers(page - 1);
            setUsers(response.data.result || []);
            setMeta(response.data.meta || DEFAULT_META);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Khong the tai danh sach nguoi dung');
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
    }, []);

    return {
        users,
        setUsers,
        currentPage,
        meta,
        fetchUsers,
        handlePageChange
    };
};

export const useUserFilter = (users: IAdminUser[]) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterRole, setFilterRole] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<AdminUserFilterStatus>('All');

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchRole = filterRole === 'All' || user.role?.name === filterRole;
            const matchStatus =
                filterStatus === 'All' ||
                (filterStatus === 'Active' && user.active) ||
                (filterStatus === 'Inactive' && !user.active);

            return matchSearch && matchRole && matchStatus;
        });
    }, [users, searchTerm, filterRole, filterStatus]);

    return {
        searchTerm,
        setSearchTerm,
        filterRole,
        setFilterRole,
        filterStatus,
        setFilterStatus,
        filteredUsers
    };
};

export const useUserModal = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<AdminUserModalType>('');
    const [selectedUser, setSelectedUser] = useState<IAdminUser | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [formData, setFormData] = useState<IAdminUserFormData>(DEFAULT_FORM_DATA);

    const handleShowModal = useCallback((type: AdminUserModalType, user: IAdminUser | null = null) => {
        setModalType(type);
        setSelectedUser(user);
        setErrorMessages([]);

        if (type === 'edit' && user) {
            setFormData({
                id: user.id,
                name: user.name,
                email: user.email,
                password: '',
                gender: (user.gender || 'MALE') as UserGender,
                address: user.address || '',
                age: user.age || '',
                role: { id: user.role?.id || 3 }
            });
        } else {
            setFormData(DEFAULT_FORM_DATA);
        }

        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedUser(null);
        setErrorMessages([]);
        setFormData(DEFAULT_FORM_DATA);
    }, []);

    return {
        showModal,
        modalType,
        selectedUser,
        errorMessages,
        setErrorMessages,
        formData,
        setFormData,
        handleShowModal,
        handleCloseModal
    };
};

export const useUserActions = (
    modalType: AdminUserModalType,
    selectedUser: IAdminUser | null,
    formData: IAdminUserFormData,
    setErrorMessages: Dispatch<SetStateAction<string[]>>,
    currentPage: number,
    fetchUsers: (page: number) => Promise<void>,
    handleCloseModal: () => void,
    setUsers: Dispatch<SetStateAction<IAdminUser[]>>
) => {
    const handleSave = useCallback(async () => {
        try {
            setErrorMessages([]);

            if (modalType === 'add') {
                const payload: IReqCreateUser = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    gender: formData.gender,
                    address: formData.address || undefined,
                    age: toSafeNumber(formData.age),
                    roleId: formData.role.id
                };

                const response = await createUser(payload);
                if (response.statusCode !== 201 && response.statusCode !== 200) {
                    const messages = Array.isArray(response.message) ? response.message : [response.message || 'Co loi xay ra khi tao nguoi dung'];
                    setErrorMessages(messages);
                    toast.error('Khong the tao nguoi dung. Vui long kiem tra lai thong tin.');
                    return;
                }

                toast.success('Tao nguoi dung thanh cong');
                await fetchUsers(currentPage);
                handleCloseModal();
                return;
            }

            if (modalType === 'edit' && selectedUser) {
                const payload: IReqUpdateUser = {
                    id: selectedUser.id,
                    name: formData.name,
                    gender: formData.gender,
                    address: formData.address || undefined,
                    age: toSafeNumber(formData.age),
                    roleId: formData.role.id
                };

                const response = await updateUser(payload);
                if (response.statusCode !== 200 && response.statusCode !== 201) {
                    const messages = Array.isArray(response.message) ? response.message : [response.message || 'Co loi xay ra khi cap nhat nguoi dung'];
                    setErrorMessages(messages);
                    toast.error('Khong the cap nhat nguoi dung. Vui long kiem tra lai thong tin.');
                    return;
                }

                toast.success('Cap nhat nguoi dung thanh cong');
                await fetchUsers(currentPage);
                handleCloseModal();
            }
        } catch (error: unknown) {
            console.error('Error saving user:', error);
            const message = error instanceof Error ? error.message : 'Co loi xay ra khi luu nguoi dung';
            setErrorMessages([message]);
            toast.error('Co loi xay ra khi luu nguoi dung');
        }
    }, [currentPage, fetchUsers, formData, handleCloseModal, modalType, selectedUser, setErrorMessages]);

    const handleDelete = useCallback(async () => {
        if (!selectedUser) {
            return;
        }

        try {
            const response = await deleteUser(selectedUser.id);
            if (response.statusCode !== 200 && response.statusCode !== 204) {
                toast.error(response.message || 'Co loi xay ra khi xoa nguoi dung');
                return;
            }

            toast.success('Xoa nguoi dung thanh cong');
            await fetchUsers(currentPage);
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Co loi xay ra khi xoa nguoi dung');
        }
    }, [currentPage, fetchUsers, handleCloseModal, selectedUser]);

    const handleToggleBan = useCallback(async (user: IAdminUser) => {
        try {
            const newStatus = !user.active;
            const response = await changeStatusUser({ id: user.id, status: newStatus });

            if (response.statusCode === 200 || response.statusCode === 201) {
                setUsers((prevUsers) =>
                    prevUsers.map((existingUser) =>
                        existingUser.id === user.id ? { ...existingUser, active: newStatus } : existingUser
                    )
                );
                toast.success(`Nguoi dung da duoc ${newStatus ? 'mo khoa' : 'khoa'} thanh cong`);
                return;
            }

            toast.error('Co loi xay ra khi thay doi trang thai nguoi dung');
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error('Co loi xay ra khi thay doi trang thai nguoi dung');
        }
    }, [setUsers]);

    return {
        handleSave,
        handleDelete,
        handleToggleBan
    };
};

export const useUser = () => {
    const { roles, fetchRoles } = useUserRolesQuery();
    const { users, setUsers, currentPage, meta, fetchUsers, handlePageChange } = useUserListQuery();
    const {
        searchTerm,
        setSearchTerm,
        filterRole,
        setFilterRole,
        filterStatus,
        setFilterStatus,
        filteredUsers
    } = useUserFilter(users);
    const {
        showModal,
        modalType,
        selectedUser,
        errorMessages,
        setErrorMessages,
        formData,
        setFormData,
        handleShowModal,
        handleCloseModal
    } = useUserModal();
    const { handleSave, handleDelete, handleToggleBan } = useUserActions(
        modalType,
        selectedUser,
        formData,
        setErrorMessages,
        currentPage,
        fetchUsers,
        handleCloseModal,
        setUsers
    );

    return {
        users,
        filteredUsers,
        roles,
        meta,
        currentPage,
        searchTerm,
        setSearchTerm,
        filterRole,
        setFilterRole,
        filterStatus,
        setFilterStatus,
        showModal,
        modalType,
        selectedUser,
        errorMessages,
        formData,
        setFormData,
        fetchUsers,
        fetchRoles,
        handlePageChange,
        handleShowModal,
        handleCloseModal,
        handleSave,
        handleDelete,
        handleToggleBan
    };
};
