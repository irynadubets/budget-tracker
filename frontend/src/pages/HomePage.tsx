import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography, Button, TextField, Paper, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const HomePage: React.FC = () => {
  const { user, fetchUserData, balance } = useContext(AuthContext);
  const [incomeList, setIncomeList] = useState([{ id: 1, amount: 500, description: 'Salary' }]);
  const [expenseList, setExpenseList] = useState([{ id: 1, amount: 200, description: 'Groceries' }]);
  const [newIncome, setNewIncome] = useState({ amount: 0, description: '' });
  const [newExpense, setNewExpense] = useState({ amount: 0, description: '' });
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [incomeSection, setIncomeSection] = useState('');
  const [expenseSection, setExpenseSection] = useState('');


  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    if (/^\d*$/.test(value)) {
      setter((prev: any) => ({ ...prev, amount: +value }));
    }
  };

  const handleAddItem = (type: string) => {
    if (type === 'income') {
      setIncomeList([...incomeList, { id: incomeList.length + 1, ...newIncome }]);
      setNewIncome({ amount: 0, description: '' });
    } else {
      setExpenseList([...expenseList, { id: expenseList.length + 1, ...newExpense }]);
      setNewExpense({ amount: 0, description: '' });
    }
  };

  const handleEditItem = (type: string, id: number) => {
    setEditItemId(id);
    const editedItem = type === 'income' ? incomeList.find(item => item.id === id) : expenseList.find(item => item.id === id);

    if (editedItem) {
      type === 'income' ? setNewIncome({ amount: editedItem.amount, description: editedItem.description }) : setNewExpense({ amount: editedItem.amount, description: editedItem.description });
    }
  };

  const handleDeleteItem = (type: string, id: number) => {
    if (type === 'income') {
      setIncomeList(incomeList.filter(item => item.id !== id));
    } else {
      setExpenseList(expenseList.filter(item => item.id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '10px' }}>
        Welcome back, {user.username}!
      </Typography>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Your Balance: ${balance.toFixed(2)}
      </Typography>
  
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ marginTop: '20px' }}>
            <Typography variant="h5" mt={3} ml={3} style={{ marginBottom: '20px' }}>
              Income:
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={newIncome.description}
                  onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  value={newIncome.amount === 0 ? '' : newIncome.amount}
                  onChange={(e) => handleInputChange(e.target.value, setNewIncome)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={() => handleAddItem('income')} startIcon={<AddCircleOutlineIcon />}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <List>
              {[...incomeList].reverse().map((item) => (
                <ListItem key={item.id}>
                  <ListItemText primary={`${item.description}: $${item.amount}`} />
                  <IconButton color="primary" onClick={() => handleEditItem('income', item.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteItem('income', item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
  
        <Grid item xs={6}>
          <Paper elevation={3} style={{ marginTop: '20px' }}>
            <Typography variant="h5" mt={3} ml={3} style={{ marginBottom: '20px' }}>
              Expenses:
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  style={{ marginLeft: '10px' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Amount"
                  variant="outlined"
                  value={newExpense.amount === 0 ? '' : newExpense.amount}
                  onChange={(e) => handleInputChange(e.target.value, setNewExpense)}
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={() => handleAddItem('expense')} startIcon={<AddCircleOutlineIcon />}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <List>
              {[...expenseList].reverse().map((item) => (
                <ListItem key={item.id}>
                  <ListItemText primary={`${item.description}: $${item.amount}`} />
                  <IconButton color="primary" onClick={() => handleEditItem('expense', item.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteItem('expense', item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
