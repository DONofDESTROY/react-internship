import MaterialTable from 'material-table';

import { useEffect, useState, useReducer, useRef } from 'react';

import tableIcons from './components/icons';

function App() {
  const [tableData, setTableData] = useState([]);
  const newPageSize = 30;
  const tableRef = useRef(null);
  useEffect(() => {
    tableRef.current.dataManager.changePageSize(newPageSize);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const requiredData = ['name', 'username', 'email', 'phone', 'website'];
        const fdata = data.map(obj =>
          requiredData.reduce((acc, curr) => {
            acc[curr] = obj[curr];
            return acc;
          }, {})
        );
        setTableData(fdata);
      });
  }, []);
  function reducer(state, action) {
    switch (action.type) {
      case 'create':
        setTableData(action.payload);
        break;
      case 'update':
        setTableData(action.payload);
        break;
      case 'delete':
        setTableData(action.payload);
        break;
      default:
        return state;
    }
  }
  // eslint-disable-next-line no-unused-vars
  const [data, dispatch] = useReducer(reducer, tableData);

  return (
    <div style={{ maxWidth: '100vw' }}>
      <MaterialTable
        icons={tableIcons}
        tableRef={tableRef}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'User Name', field: 'username' },
          { title: 'Email', field: 'email' },
          { title: 'Phone', field: 'phone' },
          { title: 'Website', field: 'website' },
        ]}
        data={tableData}
        title='crud-user'
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const data = [...tableData, newData];
                dispatch({ type: 'create', payload: data });
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tableData];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                const data = dataUpdate;
                dispatch({ type: 'update', payload: data });
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...tableData];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                const data = dataDelete;
                dispatch({ type: 'delete', payload: data });
                resolve();
              }, 1000);
            }),
        }}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tableData];
                const field = columnDef.field;
                const index = rowData.tableData.id;
                dataUpdate[index][field] = newValue;
                const data = dataUpdate;
                dispatch({ type: 'create', payload: data });
                resolve();
              }, 1000);
            });
          },
        }}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}

export default App;
