import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { approveSubject, deleteSubject, getAllSubjects, rejectSubject } from '../api/subject.api';
import type { ISubject, SubjectStatus, AdminSubjectFilterStatus, AdminSubjectModalType } from '../types/subject';

const isSubjectStatus = (value: string): value is SubjectStatus => {
    return value === 'ACTIVE' || value === 'INACTIVE' || value === 'PENDING' || value === 'REJECTED';
};

export const useSubjectQuery = () => {
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAllSubjects();
            if (response && response.statusCode === 200) {
                setSubjects(response.data.result);
                return;
            }

            setError('Khong the tai du lieu mon hoc. Vui long thu lai sau.');
            toast.error('Khong the tai du lieu mon hoc. Vui long thu lai sau.');
        } catch (fetchError) {
            console.error('Error fetching subjects:', fetchError);
            setError('Khong the tai du lieu mon hoc. Vui long thu lai sau.');
            toast.error('Khong the tai du lieu mon hoc. Vui long thu lai sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    return {
        subjects,
        setSubjects,
        loading,
        error,
        fetchSubjects
    };
};

export const useSubjectFilter = (subjects: ISubject[]) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<AdminSubjectFilterStatus>('All');

    const filteredSubjects = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return subjects.filter((subject) => {
            const matchSearch =
                !search ||
                subject.name.toLowerCase().includes(search) ||
                (subject.createUser?.name || '').toLowerCase().includes(search);

            const matchStatus = filterStatus === 'All' || subject.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [subjects, searchTerm, filterStatus]);

    const handleFilterStatusChange = useCallback((status: string) => {
        if (status === 'All' || isSubjectStatus(status)) {
            setFilterStatus(status);
        }
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus: handleFilterStatusChange,
        filteredSubjects
    };
};

export const useSubjectModal = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<AdminSubjectModalType>('');
    const [selectedSubject, setSelectedSubject] = useState<ISubject | null>(null);

    const handleShowModal = useCallback((type: AdminSubjectModalType, subject: ISubject) => {
        setModalType(type);
        setSelectedSubject(subject);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedSubject(null);
        setModalType('');
    }, []);

    return {
        showModal,
        modalType,
        selectedSubject,
        handleShowModal,
        handleCloseModal
    };
};

export const useSubjectActions = (
    selectedSubject: ISubject | null,
    setSubjects: Dispatch<SetStateAction<ISubject[]>>,
    handleCloseModal: () => void
) => {
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const handleApprove = useCallback(async () => {
        if (!selectedSubject) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await approveSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects((prev) => prev.map((item) => (item.id === selectedSubject.id ? { ...item, status: 'ACTIVE' } : item)));
                toast.success('Da duyet mon hoc thanh cong.');
                handleCloseModal();
                return;
            }

            toast.error('Khong the duyet mon hoc. Vui long thu lai.');
        } catch (approveError) {
            console.error('Error approving subject:', approveError);
            toast.error('Loi khi duyet mon hoc. Vui long thu lai.');
        } finally {
            setActionLoading(false);
        }
    }, [handleCloseModal, selectedSubject, setSubjects]);

    const handleReject = useCallback(async () => {
        if (!selectedSubject) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await rejectSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects((prev) => prev.map((item) => (item.id === selectedSubject.id ? { ...item, status: 'REJECTED' } : item)));
                toast.success('Da tu choi mon hoc.');
                handleCloseModal();
                return;
            }

            toast.error('Khong the tu choi mon hoc. Vui long thu lai.');
        } catch (rejectError) {
            console.error('Error rejecting subject:', rejectError);
            toast.error('Loi khi tu choi mon hoc. Vui long thu lai.');
        } finally {
            setActionLoading(false);
        }
    }, [handleCloseModal, selectedSubject, setSubjects]);

    const handleDelete = useCallback(async () => {
        if (!selectedSubject) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await deleteSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects((prev) => prev.filter((item) => item.id !== selectedSubject.id));
                toast.success('Da xoa mon hoc thanh cong.');
                handleCloseModal();
                return;
            }

            toast.error('Khong the xoa mon hoc. Vui long thu lai.');
        } catch (deleteError) {
            console.error('Error deleting subject:', deleteError);
            toast.error('Loi khi xoa mon hoc. Vui long thu lai.');
        } finally {
            setActionLoading(false);
        }
    }, [handleCloseModal, selectedSubject, setSubjects]);

    return {
        actionLoading,
        handleApprove,
        handleReject,
        handleDelete
    };
};

export const useSubject = () => {
    const { subjects, setSubjects, loading, error, fetchSubjects } = useSubjectQuery();
    const { searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredSubjects } = useSubjectFilter(subjects);
    const { showModal, modalType, selectedSubject, handleShowModal, handleCloseModal } = useSubjectModal();
    const { actionLoading, handleApprove, handleReject, handleDelete } = useSubjectActions(
        selectedSubject,
        setSubjects,
        handleCloseModal
    );

    return {
        subjects,
        loading,
        error,
        fetchSubjects,
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        filteredSubjects,
        showModal,
        modalType,
        selectedSubject,
        handleShowModal,
        handleCloseModal,
        actionLoading,
        handleApprove,
        handleReject,
        handleDelete
    };
};
