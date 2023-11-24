import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography, Button, TextField, Paper, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type ItemType = {
  id: number;
  amount: string;
  description: string;
};

const HomePage: React.FC = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [incomeList, setIncomeList] = useState<ItemType[]>([]);
  const [expenseList, setExpenseList] = useState<ItemType[]>([]);
  const [newIncome, setNewIncome] = useState({ amount: '', description: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', description: '' });
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const calculateBalance = (incomeList: ItemType[], expenseList: ItemType[]) => {
    const totalIncome = incomeList.reduce((sum, item) => sum + parseFloat(item.amount), 0 as number);
    const totalExpense = expenseList.reduce((sum, item) => sum + parseFloat(item.amount), 0 as number);
    setIncomeTotal(totalIncome);
    setExpenseTotal(totalExpense);
    return totalIncome - totalExpense;
  };

  const updateBalance = (newIncomeList: ItemType[], newExpenseList: ItemType[]) => {
    const calculatedBalance = calculateBalance(newIncomeList, newExpenseList);
    setBalance(calculatedBalance);
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/user-data/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens.access}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }

          const data = await response.json();
          setIncomeList(data.incomes);
          setExpenseList(data.expenses);

          const incomeTotal = data.incomeTotal || 0;
          const expenseTotal = data.expenseTotal || 0;

          setIncomeTotal(incomeTotal);
          setExpenseTotal(expenseTotal);
          setBalance(incomeTotal - expenseTotal);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, authTokens.access]);

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    if (/^\d*$/.test(value)) {
      setter((prev: any) => ({ ...prev, amount: value }));
    }
  };

  const handleAddItem = async (type: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/add-${type}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(type === 'income' ? newIncome : newExpense),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const addedItem = await response.json();
      if (type === 'income') {
        setIncomeList((prevIncomeList) => {
          const newIncomeList = [...prevIncomeList, addedItem];
          updateBalance(newIncomeList, expenseList);
          return newIncomeList;
        });
        setNewIncome({ amount: '', description: '' });
      } else {
        setExpenseList((prevExpenseList) => {
          const newExpenseList = [...prevExpenseList, addedItem];
          updateBalance(incomeList, newExpenseList);
          return newExpenseList;
        });
        setNewExpense({ amount: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (type: string, id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update-${type}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(type === 'income' ? newIncome : newExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to edit item');
      }

      const editedItem = await response.json();
      if (type === 'income') {
        setIncomeList((prevIncomeList) => {
          const newIncomeList = prevIncomeList.map((item) => (item.id === id ? editedItem : item));
          updateBalance(newIncomeList, expenseList);
          return newIncomeList;
        });
      } else {
        setExpenseList((prevExpenseList) => {
          const newExpenseList = prevExpenseList.map((item) => (item.id === id ? editedItem : item));
          updateBalance(incomeList, newExpenseList);
          return newExpenseList;
        });
      }
      setEditItemId(null);
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  const handleDeleteItem = async (type: string, id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete-${type}/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      if (type === 'income') {
        setIncomeList((prevIncomeList) => {
          const newIncomeList = prevIncomeList.filter((item) => item.id !== id);
          updateBalance(newIncomeList, expenseList);
          return newIncomeList;
        });
      } else {
        setExpenseList((prevExpenseList) => {
          const newExpenseList = prevExpenseList.filter((item) => item.id !== id);
          updateBalance(incomeList, newExpenseList);
          return newExpenseList;
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
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
              Income: ${incomeTotal.toFixed(2)}
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
                  value={newIncome.amount}
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
              Expenses: ${expenseTotal.toFixed(2)}
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
                  value={newExpense.amount}
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
