import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)
    let [balance, setBalance] = useState(0);

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value
                })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            let data = await response.json();

            localStorage.setItem('username', data.username);
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            setUser(data);
            navigate('/');
        } catch (error) {
            throw new Error('Invalid credentials. Please check your username and password.');
        }
    }

    let registerUser = async (userData) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('username', data.username);
          localStorage.setItem('authTokens', JSON.stringify(data));
          setAuthTokens(data);
          setUser(data);
          navigate('/');
        } else {
          if (data.username && data.username.length > 0) {
            return `Username error: ${data.username[0]}`;
          } else if (data.password && data.password.length > 0) {
            return `Password error:\n${data.password.join('\n')}`;
          }
        }
      } catch (error) {
        return 'Something went wrong during registration. Please try again.';
      }
    };

    let logoutUser = (e) => {
        localStorage.removeItem('authTokens')
        localStorage.removeItem('username')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }

    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ refresh : authTokens?.refresh })
        })
        const data = await response.json()
        const storedUsername = localStorage.getItem('username');

        if (response.status === 200 && storedUsername) {
            data.username = storedUsername;
            setAuthTokens(data)
            setUser(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    const fetchUserData = async () => {
      try {
        const storedTokens = JSON.parse(localStorage.getItem('authTokens'));

        if (storedTokens) {
          const response = await fetch('http://127.0.0.1:8000/api/user-data/total/', {
            headers: {
              Authorization: `Bearer ${storedTokens.access}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Unauthorized');
          }

          const userData = await response.json();

          const incomeTotal = userData.incomeTotal || 0;
          const expenseTotal = userData.expenseTotal || 0;

          setBalance(incomeTotal - expenseTotal);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
        fetchUserData: fetchUserData,
        balance: balance,
        setBalance: setBalance,
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 1
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)

        const storedTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (storedTokens && storedTokens.username) {
            setUser(storedTokens);
        }

        if (loading) {
            setLoading(false);
        }

        return () => clearInterval(interval);
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
