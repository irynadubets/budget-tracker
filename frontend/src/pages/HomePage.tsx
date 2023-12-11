import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography, Button, TextField, Paper, Grid, List, ListItem, ListItemText, IconButton, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

type ItemType = {
  id: number;
  amount: string;
  description: string;
  section: string;
};

const HomePage: React.FC = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [incomeList, setIncomeList] = useState<ItemType[]>([]);
  const [expenseList, setExpenseList] = useState<ItemType[]>([]);
  const incomeSections = ['Salary', 'Freelance'];
  const expenseSections = ['Food', 'Eating out', 'Home', 'Bad habits', 'Car', 'Transport', 'Health', 'Clothes', 'Gifts'];
  const [newIncome, setNewIncome] = useState({ amount: '', description: '', section: '' });
  const [newExpense, setNewExpense] = useState({ amount: '', description: '', section: '' });
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [selectedIncomeSection, setSelectedIncomeSection] = useState<string>(incomeSections[0]);
  const [selectedExpenseSection, setSelectedExpenseSection] = useState<string>(expenseSections[0]);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editSection, setEditSection] = useState('');

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
          const response = await fetch('http://127.0.0.1:8000/api/user-data/total/', {
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
    if (/^\d*\.?\d*$/.test(value)) {
      console.log("passed check", typeof value);
      setter((prev: any) => ({ ...prev, amount: value }));
    }
  };

  const handleAddItem = async (type: string) => {
    try {
      const section = type === 'income' ? selectedIncomeSection : selectedExpenseSection;
      const response = await fetch(`http://127.0.0.1:8000/api/add-${type}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(type === 'income' ? { ...newIncome, section } : { ...newExpense, section }),
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
        setNewIncome({ amount: '', description: '', section: '' });
      } else {
        setExpenseList((prevExpenseList) => {
          const newExpenseList = [...prevExpenseList, addedItem];
          updateBalance(incomeList, newExpenseList);
          return newExpenseList;
        });
        setNewExpense({ amount: '', description: '', section: '' });
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (type: string, id: number) => {
    const selectedItem = type === 'income' ? incomeList.find(item => item.id === id) : expenseList.find(item => item.id === id);
    console.log("handleEditItem")
    if (selectedItem) {
      setEditDescription(selectedItem.description);
      setEditAmount(selectedItem.amount);
      setEditSection(selectedItem.section);
      setEditItemId(id);
    }
  };

  const handleSaveItem = async (type: string, id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update-${type}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          description: editDescription,
          amount: editAmount,
          section: editSection,
        }),
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
              <Grid item xs={4}>
                <Select
                  label="Section"
                  value={selectedIncomeSection}
                  onChange={(e) => setSelectedIncomeSection(e.target.value)}
                >
                  {incomeSections.map((section) => (
                    <MenuItem key={section} value={section}>
                      {section}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop="8px">
              <Grid item xs={2}>
                <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAddItem('income')}>
                  ADD
                </Button>
              </Grid>
            </Grid>
            <List>
              {[...incomeList].reverse().map((item) => (
                <ListItem key={item.id}>
                  {editItemId === item.id ? (
                    <>
                      <TextField
                        label="Description"
                        variant="outlined"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <TextField
                        label="Amount"
                        variant="outlined"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                      <Select
                        label="Section"
                        value={editSection}
                        onChange={(e) => setEditSection(e.target.value)}
                      >
                        {incomeSections.map((section) => (
                          <MenuItem key={section} value={section}>
                            {section}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton color="primary" onClick={() => handleSaveItem('income', item.id)}>
                        <CheckIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={`${item.description}: $${item.amount}`} />
                      <Typography style={{ marginRight: 8 }}>{item.section}</Typography>
                    </>
                  )}
                  <IconButton color="primary" onClick={() => handleEditItem('income', item.id)}>
                    {editItemId === item.id ? (
                      <></>
                    ) : (
                      <EditIcon />
                    )}
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
              <Grid item xs={4}>
                <Select
                  label="Section"
                  value={selectedExpenseSection}
                  onChange={(e) => setSelectedExpenseSection(e.target.value)}
                >
                  {expenseSections.map((section) => (
                    <MenuItem key={section} value={section}>
                      {section}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop="8px">
              <Grid item xs={2}>
                <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAddItem('expense')}>
                  ADD
                </Button>
              </Grid>
            </Grid>
            <List>
              {[...expenseList].reverse().map((item) => (
                <ListItem key={item.id}>
                  {editItemId === item.id ? (
                    <>
                      <TextField
                        label="Description"
                        variant="outlined"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <TextField
                        label="Amount"
                        variant="outlined"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                      <Select
                        label="Section"
                        value={editSection}
                        onChange={(e) => setEditSection(e.target.value)}
                      >
                        {expenseSections.map((section) => (
                          <MenuItem key={section} value={section}>
                            {section}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton color="primary" onClick={() => handleSaveItem('expense', item.id)}>
                        <CheckIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={`${item.description}: $${item.amount}`} />
                      <Typography style={{ marginRight: 8 }}>{item.section}</Typography>
                    </>
                  )}
                  <IconButton color="primary" onClick={() => handleEditItem('expense', item.id)}>
                    {editItemId === item.id ? (
                      <></>
                    ) : (
                      <EditIcon />
                    )}
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
