import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from "../../services/axiosClient";
import { orderBy } from 'lodash';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';

const Feedback = () => {
  const { t } = useTranslation();
  const [feedbackList, setFeedbackList] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const toast = React.useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.current.show({
          severity: "error",
          summary: t('error.title'),
          detail: t('error.fetchUsers'),
          life: 3000,
        });
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/feedback');
        setFeedbackList(response.data);
        setTotalRecords(response.data.length);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast.current.show({
          severity: "error",
          summary: t('error.title'),
          detail: t('error.fetchFeedback'),
          life: 3000,
        });
      }
    };

    fetchUsers();
    fetchFeedback();
  }, [t]);

  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setSize(event.rows);
  };

  const sortedFeedbackList = orderBy(feedbackList, ['date'], ['desc']).slice(currentPage * size, (currentPage + 1) * size);

  return (
    <div className="container mx-auto p-4">
      <Toast ref={toast} />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{t('sidebar.feedback')}</h2>
      <DataTable
        value={sortedFeedbackList}
        loading={feedbackList.length === 0}
        rows={size}
        first={currentPage * size}
        className="p-datatable-custom"
      >
        <Column
          field="sequentialID"
          header={t('a.table.headers.no')}
          body={(rowData, { rowIndex }) => rowIndex + 1 + currentPage * size}
          sortable
          style={{ width: '5%' }}
        />
        <Column
          field="username"
          header={t('a.table.headers.user')}
          body={(rowData) => getUsernameById(rowData.userId)}
          sortable
          style={{ width: '25%' }}
        />
        <Column
          field="description"
          header={t('a.table.headers.feedback')}
          sortable
          style={{ width: '50%' }}
        />
        <Column
          field="date"
          header={t('a.table.headers.date')}
          body={(rowData) => new Date(rowData.date).toLocaleString()}
          sortable
          style={{ width: '20%' }}
        />
      </DataTable>
      <Paginator
        className="mt-4"
        first={currentPage * size}
        rows={size}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Feedback;