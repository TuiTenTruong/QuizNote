import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import {
    getRolesPaginated,
    createRole,
    updateRole,
    deleteRole,
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission
} from '../api/role.api';
import type {
    IRole,
    IPermission,
    IReqCreateRole,
    IReqUpdateRole,
    IReqCreatePermission,
    IReqUpdatePermission,
    PermissionMethod,
    PermissionModule,
    RolePermissionModalType,
    IRoleFormData,
    IPermissionFormData
} from '../types/role';

const DEFAULT_ROLE_FORM: IRoleFormData = {
    name: '',
    description: '',
    active: true
};

const DEFAULT_PERMISSION_FORM: IPermissionFormData = {
    name: '',
    apiPath: '',
    method: 'GET',
    module: 'USERS'
};

export const useRoleQuery = () => {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [rolePage, setRolePage] = useState<number>(0);
    const [roleTotalPages, setRoleTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getRolesPaginated(rolePage, 10);
            setRoles(response.data.result || []);
            setRoleTotalPages(response.data.meta.pages || 0);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Khong the tai danh sach vai tro');
        } finally {
            setLoading(false);
        }
    }, [rolePage]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    return {
        roles,
        rolePage,
        setRolePage,
        roleTotalPages,
        loading,
        setLoading,
        fetchRoles
    };
};

export const usePermissionQuery = () => {
    const [permissions, setPermissions] = useState<IPermission[]>([]);

    const fetchPermissions = useCallback(async () => {
        try {
            const response = await getAllPermissions(0, 100);
            setPermissions(response.data.result || []);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Khong the tai danh sach quyen han');
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    return {
        permissions,
        setPermissions,
        fetchPermissions
    };
};

export const useRolePermissionFilter = (permissions: IPermission[]) => {
    const [filterModule, setFilterModule] = useState<string>('');
    const [filterMethod, setFilterMethod] = useState<string>('');
    const [searchName, setSearchName] = useState<string>('');

    const filteredPermissions = useMemo(() => {
        return permissions.filter((permission) => {
            const matchesModule = !filterModule || permission.module === filterModule;
            const matchesMethod = !filterMethod || permission.method === filterMethod;
            const matchesName = !searchName || permission.name.toLowerCase().includes(searchName.toLowerCase());

            return matchesModule && matchesMethod && matchesName;
        });
    }, [permissions, filterMethod, filterModule, searchName]);

    return {
        filterModule,
        setFilterModule,
        filterMethod,
        setFilterMethod,
        searchName,
        setSearchName,
        filteredPermissions
    };
};

export const useRolePermissionModal = () => {
    const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
    const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<RolePermissionModalType>('');
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
    const [roleFormData, setRoleFormData] = useState<IRoleFormData>(DEFAULT_ROLE_FORM);
    const [permissionFormData, setPermissionFormData] = useState<IPermissionFormData>(DEFAULT_PERMISSION_FORM);
    const [selectedPermissionsForRole, setSelectedPermissionsForRole] = useState<number[]>([]);

    const handleShowRoleModal = useCallback((type: RolePermissionModalType, role: IRole | null = null) => {
        setModalType(type);
        setSelectedRole(role);

        if (type === 'edit' && role) {
            setRoleFormData({
                name: role.name,
                description: role.description || '',
                active: role.active ?? true
            });
        } else {
            setRoleFormData(DEFAULT_ROLE_FORM);
        }

        setShowRoleModal(true);
    }, []);

    const handleShowPermissionModal = useCallback((type: RolePermissionModalType, permission: IPermission | null = null) => {
        setModalType(type);
        setSelectedPermission(permission);

        if (type === 'edit' && permission) {
            setPermissionFormData({
                name: permission.name,
                apiPath: permission.apiPath || '',
                method: permission.method || 'GET',
                module: permission.module
            });
        } else {
            setPermissionFormData(DEFAULT_PERMISSION_FORM);
        }

        setShowPermissionModal(true);
    }, []);

    const handleShowAssignModal = useCallback((role: IRole) => {
        setSelectedRole(role);
        const permissionIds = role.permissions ? role.permissions.map((permission) => permission.id) : [];
        setSelectedPermissionsForRole(permissionIds);
        setShowAssignModal(true);
    }, []);

    const handleTogglePermission = useCallback((permissionId: number) => {
        setSelectedPermissionsForRole((prev) =>
            prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
        );
    }, []);

    return {
        showRoleModal,
        setShowRoleModal,
        showPermissionModal,
        setShowPermissionModal,
        showAssignModal,
        setShowAssignModal,
        modalType,
        selectedRole,
        setSelectedRole,
        selectedPermission,
        roleFormData,
        setRoleFormData,
        permissionFormData,
        setPermissionFormData,
        selectedPermissionsForRole,
        handleShowRoleModal,
        handleShowPermissionModal,
        handleShowAssignModal,
        handleTogglePermission
    };
};

export const useRolePermissionActions = (
    loadingState: { loading: boolean; setLoading: Dispatch<SetStateAction<boolean>> },
    roleState: { roles: IRole[]; fetchRoles: () => Promise<void> },
    permissionState: { permissions: IPermission[]; fetchPermissions: () => Promise<void> },
    modalState: {
        modalType: RolePermissionModalType;
        selectedRole: IRole | null;
        selectedPermission: IPermission | null;
        roleFormData: IRoleFormData;
        permissionFormData: IPermissionFormData;
        selectedPermissionsForRole: number[];
        setShowRoleModal: (value: boolean) => void;
        setShowPermissionModal: (value: boolean) => void;
        setShowAssignModal: (value: boolean) => void;
    }
) => {
    const { setLoading } = loadingState;
    const { fetchRoles } = roleState;
    const { permissions, fetchPermissions } = permissionState;
    const {
        modalType,
        selectedRole,
        selectedPermission,
        roleFormData,
        permissionFormData,
        selectedPermissionsForRole,
        setShowRoleModal,
        setShowPermissionModal,
        setShowAssignModal
    } = modalState;

    const handleSaveRole = useCallback(async () => {
        try {
            setLoading(true);

            if (modalType === 'add') {
                const payload: IReqCreateRole = {
                    name: roleFormData.name,
                    description: roleFormData.description,
                    active: roleFormData.active
                };
                await createRole(payload);
                toast.success('Tao vai tro thanh cong');
                await fetchRoles();
            }

            if (modalType === 'edit' && selectedRole) {
                const payload: IReqUpdateRole = {
                    id: selectedRole.id,
                    name: roleFormData.name,
                    description: roleFormData.description,
                    active: roleFormData.active
                };
                await updateRole(payload);
                toast.success('Cap nhat vai tro thanh cong');
                await fetchRoles();
            }

            setShowRoleModal(false);
        } catch (error: unknown) {
            console.error('Error saving role:', error);
            toast.error('Co loi xay ra khi luu vai tro');
        } finally {
            setLoading(false);
        }
    }, [fetchRoles, modalType, roleFormData, selectedRole, setLoading, setShowRoleModal]);

    const handleDeleteRole = useCallback(async () => {
        if (!selectedRole) {
            return;
        }

        try {
            setLoading(true);
            await deleteRole(selectedRole.id);
            toast.success('Xoa vai tro thanh cong');
            await fetchRoles();
            setShowRoleModal(false);
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error('Khong the xoa vai tro');
        } finally {
            setLoading(false);
        }
    }, [fetchRoles, selectedRole, setLoading, setShowRoleModal]);

    const handleSavePermission = useCallback(async () => {
        try {
            setLoading(true);

            if (modalType === 'add') {
                const payload: IReqCreatePermission = {
                    name: permissionFormData.name,
                    apiPath: permissionFormData.apiPath,
                    method: permissionFormData.method,
                    module: permissionFormData.module
                };
                await createPermission(payload);
                toast.success('Tao quyen han thanh cong');
                await fetchPermissions();
            }

            if (modalType === 'edit' && selectedPermission) {
                const payload: IReqUpdatePermission = {
                    id: selectedPermission.id,
                    name: permissionFormData.name,
                    apiPath: permissionFormData.apiPath,
                    method: permissionFormData.method,
                    module: permissionFormData.module
                };
                await updatePermission(payload);
                toast.success('Cap nhat quyen han thanh cong');
                await fetchPermissions();
            }

            setShowPermissionModal(false);
        } catch (error) {
            console.error('Error saving permission:', error);
            toast.error('Co loi xay ra khi luu quyen han');
        } finally {
            setLoading(false);
        }
    }, [fetchPermissions, modalType, permissionFormData, selectedPermission, setLoading, setShowPermissionModal]);

    const handleDeletePermission = useCallback(async () => {
        if (!selectedPermission) {
            return;
        }

        try {
            setLoading(true);
            await deletePermission(selectedPermission.id);
            toast.success('Xoa quyen han thanh cong');
            await fetchPermissions();
            await fetchRoles();
            setShowPermissionModal(false);
        } catch (error) {
            console.error('Error deleting permission:', error);
            toast.error('Khong the xoa quyen han');
        } finally {
            setLoading(false);
        }
    }, [fetchPermissions, fetchRoles, selectedPermission, setLoading, setShowPermissionModal]);

    const handleSaveAssignments = useCallback(async () => {
        if (!selectedRole) {
            return;
        }

        try {
            setLoading(true);

            const selectedPermissions = permissions.filter((permission) =>
                selectedPermissionsForRole.includes(permission.id)
            );

            const payload: IReqUpdateRole = {
                id: selectedRole.id,
                name: selectedRole.name,
                description: selectedRole.description,
                active: selectedRole.active,
                permissions: selectedPermissions.map((permission) => permission.id)
            };

            await updateRole(payload);
            toast.success('Cap nhat quyen han cho vai tro thanh cong');
            await fetchRoles();
            setShowAssignModal(false);
        } catch (error) {
            console.error('Error assigning permissions:', error);
            toast.error('Khong the cap nhat quyen han');
        } finally {
            setLoading(false);
        }
    }, [fetchRoles, permissions, selectedPermissionsForRole, selectedRole, setLoading, setShowAssignModal]);

    return {
        handleSaveRole,
        handleDeleteRole,
        handleSavePermission,
        handleDeletePermission,
        handleSaveAssignments
    };
};

export const useRolePermission = () => {
    const {
        roles,
        rolePage,
        setRolePage,
        roleTotalPages,
        loading,
        setLoading,
        fetchRoles
    } = useRoleQuery();
    const { permissions, fetchPermissions } = usePermissionQuery();
    const {
        filterModule,
        setFilterModule,
        filterMethod,
        setFilterMethod,
        searchName,
        setSearchName,
        filteredPermissions
    } = useRolePermissionFilter(permissions);
    const {
        showRoleModal,
        setShowRoleModal,
        showPermissionModal,
        setShowPermissionModal,
        showAssignModal,
        setShowAssignModal,
        modalType,
        selectedRole,
        setSelectedRole,
        selectedPermission,
        roleFormData,
        setRoleFormData,
        permissionFormData,
        setPermissionFormData,
        selectedPermissionsForRole,
        handleShowRoleModal,
        handleShowPermissionModal,
        handleShowAssignModal,
        handleTogglePermission
    } = useRolePermissionModal();

    const {
        handleSaveRole,
        handleDeleteRole,
        handleSavePermission,
        handleDeletePermission,
        handleSaveAssignments
    } = useRolePermissionActions(
        { loading, setLoading },
        { roles, fetchRoles },
        { permissions, fetchPermissions },
        {
            modalType,
            selectedRole,
            selectedPermission,
            roleFormData,
            permissionFormData,
            selectedPermissionsForRole,
            setShowRoleModal,
            setShowPermissionModal,
            setShowAssignModal
        }
    );

    return {
        roles,
        permissions,
        filteredPermissions,
        loading,
        showRoleModal,
        setShowRoleModal,
        showPermissionModal,
        setShowPermissionModal,
        showAssignModal,
        setShowAssignModal,
        modalType,
        selectedRole,
        setSelectedRole,
        selectedPermission,
        roleFormData,
        setRoleFormData,
        permissionFormData,
        setPermissionFormData,
        selectedPermissionsForRole,
        rolePage,
        setRolePage,
        roleTotalPages,
        filterModule,
        setFilterModule,
        filterMethod,
        setFilterMethod,
        searchName,
        setSearchName,
        fetchRoles,
        fetchPermissions,
        handleShowRoleModal,
        handleSaveRole,
        handleDeleteRole,
        handleShowPermissionModal,
        handleSavePermission,
        handleDeletePermission,
        handleShowAssignModal,
        handleTogglePermission,
        handleSaveAssignments
    };
};
